import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { AlreadyExistsError, KnownInternalServerError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, OverlayNamedURL, OverlayTemplate, OverlayTemplateEntry, ResourceNotFoundError } from '~/types';
import { InferSelectModel, and, eq } from 'drizzle-orm';
import * as schema from '~/instance/database/schema';
import db from '~/instance/database';
import { getSession } from '~/instance/auth';

import EntryController from './template/entry';
import files from '~/instance/files';

const tags = ['team/template'];

export const DisplayName = t.String({
	minLength: 1,
	maxLength: 64
});

export const Description = t.String({
	maxLength: 500
});

export class APITemplate {
	id: string;
	teamId: string;
	slug: string;

	displayName: string;
	description: string;

	createdAt: Date;

	constructor(template: InferSelectModel<typeof schema.templates>, slug: InferSelectModel<typeof schema.slugs>) {
		this.id = template.id;
		this.teamId = template.teamId;
		this.slug = slug.slug;

		this.displayName = template.displayName;
		this.description = template.description;

		this.createdAt = template.createdAt;
	}
}

export default new Elysia()
	.use(EntryController)
	.get('/team/:namespace/templates', 
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const teamTemplates = await db.query.templates.findMany({
				where: eq(schema.templates.teamId, team.id)
			});
			
			return (await Promise.all(teamTemplates.map(async template => {
				const slug = await db.query.slugs.findFirst({
					where: and(
						eq(schema.slugs.teamId, team.id),
						eq(schema.slugs.templateId, template.id)
					)
				});
				if (slug == undefined) throw new KnownInternalServerError({
					message: 'Template without a corresponding slug',
					slug, template, team
				});

				return new APITemplate(template, slug);
			}))).filter(m => m != undefined) as APITemplate[];
		},
		{
			detail: { tags, summary: 'Get team templates' },
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.put('/team/:namespace/template/:slug', 
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can create templates
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canManageTemplates) throw new NotAuthorizedError();

			// Check if slug is taken
			if ((await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug)
				)
			})) != undefined) throw new AlreadyExistsError('Slug');

			// Create the template
			const template = await db.insert(schema.templates).values({
				teamId: team.id,
				displayName: context.body.displayName,
				description: context.body.description
			}).returning();

			// Create the slug
			const slug = await db.insert(schema.slugs).values({
				teamId: team.id,
				slug: context.params.slug,
				templateId: template[0].id
			}).returning();

			return Response.json(new APITemplate(template[0], slug[0]));
		},
		{
			detail: { tags, summary: 'Create a new template' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			}),
			body: t.Object({
				displayName: DisplayName,
				description: Description
			})
		}
	)
	.get('/team/:namespace/template/:slug', 
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const slug = await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug),
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();
			
			const template = await db.query.templates.findFirst({
				where: eq(schema.templates.id, slug.templateId),
			});
			if (template == undefined) throw new KnownInternalServerError({
				message: 'Slug with templateId without a corresponding template',
				template, slug, team
			});

			return Response.json(new APITemplate(template, slug));
		},
		{
			detail: { tags, summary: 'Get template details' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)
	.patch('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Update template details' } }
	)
	.delete('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Delete a template' } }
	)
	.get('/team/:namespace/template/:slug/overlay', 
		async (context) => {
			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get slug
			const slug = await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug),
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();
			
			// Get template
			const template = await db.query.templates.findFirst({
				where: eq(schema.templates.id, slug.templateId),
			});
			if (template == undefined) throw new KnownInternalServerError({
				message: 'Slug with templateId without a corresponding template',
				template, slug, team
			});

			// Get entries
			const entries = await db.query.entries.findMany({
				where: eq(schema.entries.templateId, template.id)
			});

			// Return template definition
			return Response.json({
				faction: `${template.displayName} (${team.displayName})`,
				contact: team.contactInfo,
				// Convert DB template entries to overlay template entries
				templates: await Promise.all(entries.map(async (entry) => {
					let sources: string[] = [];
					if (entry.fileId != null) {
						const file = await files.get(entry.fileId);
						if (file != undefined) sources.push(file.getPublicUrl());
					}

					return {
						name: entry.displayName,
						sources,
						x: entry.positionX, y: entry.positionY
					}
				})),
				whitelist: [],
				blacklist: []
			} as OverlayTemplate);
		},
		{
			detail: { tags, summary: 'Get overlay template definition reflecting this template' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)
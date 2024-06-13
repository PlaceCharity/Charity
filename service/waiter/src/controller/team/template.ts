import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, t } from 'elysia';
import { AlreadyExistsError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, ResourceNotFoundError } from '~/types';
import { InferSelectModel, and, like } from 'drizzle-orm';
import { slugs, teamMembers, teams, templates } from '~/instance/database/schema';
import db from '~/instance/database';
import { getSession } from '~/instance/auth';

import EntryController from './template/entry';

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

	constructor(template: InferSelectModel<typeof templates>, slug: InferSelectModel<typeof slugs>) {
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
				where: like(teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const teamTemplates = await db.query.templates.findMany({
				where: like(templates.teamId, team.id)
			});
			
			return (await Promise.all(teamTemplates.map(async template => {
				const slug = await db.query.slugs.findFirst({
					where: and(
						like(slugs.teamId, team.id),
						like(slugs.templateId, template.id)
					)
				});
				if (slug == undefined) {
					console.error('Template without a corresponding slug', JSON.stringify({ slug, template, team }));
					throw new InternalServerError();
				}

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
				where: like(teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can create templates
			const member = await db.query.teamMembers.findFirst({
				where: and(
					like(teamMembers.teamId, team.id),
					like(teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canManageTemplates) throw new NotAuthorizedError();

			// Check if slug is taken
			if ((await db.query.slugs.findFirst({
				where: and(
					like(slugs.teamId, team.id),
					like(slugs.slug, context.params.slug)
				)
			})) != undefined) throw new AlreadyExistsError('Slug');

			// Create the template
			const template = await db.insert(templates).values({
				teamId: team.id,
				displayName: context.body.displayName,
				description: context.body.description
			}).returning();

			// Create the slug
			const slug = await db.insert(slugs).values({
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
				where: like(teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const slug = await db.query.slugs.findFirst({
				where: and(
					like(slugs.teamId, team.id),
					like(slugs.slug, context.params.slug),
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();
			
			const template = await db.query.templates.findFirst({
				where: like(templates.id, slug.templateId),
			});
			if (template == undefined) {
				console.error('Slug with templateId without a corresponding template', JSON.stringify({ template, slug, team }));
				throw new InternalServerError();
			}

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
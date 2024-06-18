import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, NotFoundError, t } from 'elysia';
import { AlreadyExistsError, BadRequestError, KnownInternalServerError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, OverlayTemplate, ResourceNotFoundError } from '~/types';
import { APIUser } from '~/controller/user';
import db from '~/instance/database';
import * as schema from '~/instance/database/schema';
import { InferSelectModel, SQL, and, eq } from 'drizzle-orm';
import { getSession } from '~/instance/auth';
import { SQLiteError } from 'bun:sqlite';

import TemplateController from './team/template';
import LinkController from './team/link';
import MemberController from './team/member';
import InviteController from './team/invite';

const tags = ['team'];

export const Namespace = t.String({
	minLength: 2,
	maxLength: 20,
	pattern: '^[a-zA-Z0-9\-\_]+$'
});

export const DisplayName = t.String({
	minLength: 1,
	maxLength: 64
});

export const Description = t.String({
	maxLength: 500
});

export const ContactInfo = t.String({
	minLength: 1,
	maxLength: 96
})

export class APITeam {
	id: string;
	namespace: string;

	displayName: string;
	contactInfo: string;

	description: string;

	createdAt: Date;

	constructor(team: InferSelectModel<typeof schema.teams>) {
		this.id = team.id;
		this.namespace = team.namespace;

		this.displayName = team.displayName;
		this.contactInfo = team.contactInfo;

		this.description = team.description;

		this.createdAt = team.createdAt;
	}
}

export default new Elysia()
	.use(TemplateController)
	.use(LinkController)
	.use(MemberController)
	.use(InviteController)
	.post('/team/:namespace',
		async (context) => {
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Create team
			const team = await db.insert(schema.teams).values({
				namespace: context.params.namespace,
				displayName: context.body.displayName,
				contactInfo: context.body.contactInfo,
				description: context.body.description
			}).returning().catch((err) => {
				if (err instanceof SQLiteError) {
					if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
						throw new AlreadyExistsError('Namespace');
					}
				}
				throw err;
			});

			// Add creator to team members as owner
			await db.insert(schema.teamMembers).values({
				teamId: team[0].id,
				userId: session.user.id,

				canManageTemplates: true,
				canManageLinks: true,

				canInviteMembers: true,
				canManageMembers: true,

				canEditTeam: true,

				isOwner: true
			});

			return Response.json(new APITeam(team[0]));
		},
		{
			detail: { tags, summary: 'Create a new team' },
			params: t.Object({
				namespace: Namespace
			}),
			body: t.Object({
				displayName: DisplayName,
				description: Description,
				contactInfo: ContactInfo
			})
		}
	)
	.get('/team/:namespace', 
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// TODO: Remove this workaround? see user.ts
			return Response.json(new APITeam(team));
		},
		{
			detail: { tags, summary: 'Get team details' },
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.patch('/team/:namespace', 
		async (context) => {
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();
				
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can edit the team
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canEditTeam) throw new NotAuthorizedError();

			const updatedTeam = await db.update(schema.teams).set({
				namespace: context.body.namespace,
				displayName: context.body.displayName,
				description: context.body.description,
				contactInfo: context.body.contactInfo
			}).where(eq(schema.teams.id, team.id)).returning().catch((err) => {
				if (err instanceof SQLiteError) {
					if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
						throw new AlreadyExistsError('Namespace');
					}
				}
				throw err;
			});
			if (updatedTeam.length == 0) throw new ResourceNotFoundError();

			return Response.json(new APITeam(updatedTeam[0]));
		},
		{
			detail: { tags, summary: 'Update team details' },
			params: t.Object({
				namespace: t.String()
			}),
			body: t.Object({
				namespace: t.Optional(Namespace),
				displayName: t.Optional(DisplayName),
				description: t.Optional(Description),
				contactInfo: t.Optional(ContactInfo)
			})
		}
	)
	.delete('/team/:namespace', 
		async (context) => {
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();
				
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can delete the team
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.isOwner) throw new NotAuthorizedError();

			const deletedTeam = await db.delete(schema.teams).where(eq(schema.teams.id, team.id)).returning();
			if (!deletedTeam || deletedTeam.length == 0) throw new ResourceNotFoundError();

			return;
		},
		{
			detail: { tags, summary: 'Delete a team' },
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.get('/team/:namespace/overlay',
		async (context) => {
			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get templates
			const templates = await db.query.templates.findMany({
				where: eq(schema.templates.teamId, team.id)
			});

			return Response.json({
				faction: team.displayName,
				contact: team.contactInfo,
				templates: [],
				whitelist: [
					// Faction's templates
					...await Promise.all(templates.map(async (template) => {
						const slug = await db.query.slugs.findFirst({
							where: eq(schema.slugs.templateId, template.id)
						});
						if (slug == undefined) throw new KnownInternalServerError({
							message: 'Template with no corresponding slug',
							slug, template, templates, team
						});

						return { name: template.displayName, url: new URL(`/team/${team.namespace}/template/${slug.slug}/overlay`, env.BASE_URL).toString() };
					}))
					// TODO: Allies
				],
				blacklist: [
					// TODO: Enemies
				]
			} as OverlayTemplate);
		},
		{
			detail: { tags, summary: 'Get overlay template definition reflecting this team\'s templates and relationships' },
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.get('/team/:namespace/slug/:slug',
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
			if (slug == undefined) throw new ResourceNotFoundError();

			if (slug.linkId != undefined) {
				return context.redirect(`/team/${context.params.namespace}/link/${slug.slug}`, 302);
			} else if (slug.templateId != undefined) {
				return context.redirect(`/team/${context.params.namespace}/template/${slug.slug}`, 302);
			} else throw new KnownInternalServerError({
				message: 'Slug with no corresponding link OR template',
				slug, team
			});
		},
		{
			detail: { tags, summary: 'Get resource from slug' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)

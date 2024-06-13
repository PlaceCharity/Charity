import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, NotFoundError, t } from 'elysia';
import { APIUser, AlreadyExistsError, BadRequestError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, ResourceNotFoundError } from '~/types';
import db from '~/instance/database';
import { teams, teamMembers, users, slugs } from '~/instance/database/schema';
import { InferSelectModel, SQL, and, like } from 'drizzle-orm';
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

	constructor(team: InferSelectModel<typeof teams>) {
		this.id = team.id;
		this.namespace = team.namespace;

		this.displayName = team.displayName;
		this.contactInfo = team.contactInfo;

		this.description = team.description;

		this.createdAt = team.createdAt;
	}
}

export class APITeamMember {
	teamId: string;
	user: APIUser;
	
	canManageTemplates: boolean;
	canManageLinks: boolean;

	canInviteMembers: boolean;
	canManageMembers: boolean;

	canEditTeam: boolean;

	isOwner: boolean;

	createdAt: Date;

	constructor(member: InferSelectModel<typeof teamMembers>, user: APIUser) {
		this.teamId = member.teamId;
		this.user = user;

		this.canManageTemplates = member.canManageTemplates;
		this.canManageLinks = member.canManageLinks;

		this.canInviteMembers = member.canInviteMembers;
		this.canManageMembers = member.canManageMembers;

		this.canEditTeam = member.canEditTeam;

		this.isOwner = member.isOwner ?? false;

		this.createdAt = member.createdAt;
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
			const team = await db.insert(teams).values({
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
			await db.insert(teamMembers).values({
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
				where: like(teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const members = await db.query.teamMembers.findMany({
				where: like(teamMembers.teamId, team.id)
			});

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
				where: like(teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can edit the team
			const member = await db.query.teamMembers.findFirst({
				where: and(
					like(teamMembers.teamId, team.id),
					like(teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canEditTeam) throw new NotAuthorizedError();

			const updatedTeam = await db.update(teams).set({
				namespace: context.body.namespace,
				displayName: context.body.displayName,
				description: context.body.description,
				contactInfo: context.body.contactInfo
			}).where(like(teams.id, team.id)).returning().catch((err) => {
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
				where: like(teams.namespace, context.params.namespace)
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can delete the team
			const member = await db.query.teamMembers.findFirst({
				where: and(
					like(teamMembers.teamId, team.id),
					like(teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.isOwner) throw new NotAuthorizedError();

			const deletedTeam = await db.delete(teams).where(like(teams.id, team.id)).returning();
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
	.get('/team/:namespace/slug/:slug',
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
			if (slug == undefined) throw new ResourceNotFoundError();

			if (slug.linkId != undefined) {
				return context.redirect(`/team/${context.params.namespace}/link/${slug.slug}`, 302);
			} else if (slug.templateId != undefined) {
				return context.redirect(`/team/${context.params.namespace}/template/${slug.slug}`, 302);
			} else {
				console.error('Slug with no corresponding link OR template', JSON.stringify({ slug, team }));
				throw new InternalServerError();
			}
		},
		{
			detail: { tags, summary: 'Get resource from slug' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)

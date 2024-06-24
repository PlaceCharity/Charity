import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { NotAuthorizedError, NotAuthenticatedError, NotImplementedError, ResourceNotFoundError, BadRequestError, AlreadyExistsError, KnownInternalServerError, TeamMemberPermissions } from '~/types';
import { APIUser } from '~/controller/user';
import { APITeamMember } from './member';
import { InferSelectModel, SQL, and, eq } from 'drizzle-orm';
import * as schema from '~/instance/database/schema';
import db from '~/instance/database';
import { getSession } from '~/instance/auth';
import { SQLiteError } from 'bun:sqlite';

const tags = ['team/invite'];

export class PartialAPIInvite {
	id: string;

	teamId: string;
	inviterId: string;

	canManageTemplates: boolean;
	canManageLinks: boolean;
	canManageRelationships: boolean;

	canInviteMembers: boolean;
	canManageMembers: boolean;

	canEditTeam: boolean;

	createdAt: Date;

	constructor(invite: InferSelectModel<typeof schema.invites>) {
		this.id = invite.id;

		this.teamId = invite.teamId;
		this.inviterId = invite.inviterId;

		this.canManageTemplates = invite.canManageTemplates;
		this.canManageLinks = invite.canManageLinks;
		this.canManageRelationships = invite.canManageRelationships;

		this.canInviteMembers = invite.canInviteMembers;
		this.canManageMembers = invite.canManageMembers;

		this.canEditTeam = invite.canEditTeam;

		this.createdAt = invite.createdAt;
	}
}

export class APIInvite extends PartialAPIInvite {
	key: string;

	constructor(invite: InferSelectModel<typeof schema.invites>) {
		super(invite);
		this.key = invite.key;
	}
}

export default new Elysia()
	.get('/team/:namespace/invites', 
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined) throw new NotAuthorizedError();

			// If we don't have canManageMembers, only get the invites we created
			let condition: SQL<unknown> | undefined = eq(schema.invites.teamId, team.id);
			if (!member.canManageMembers) condition = and(condition, eq(schema.invites.inviterId, member.userId));

			// Get and return invites
			const teamInvites = await db.query.invites.findMany({
				where: condition
			});

			return Response.json(teamInvites.map((invite) => new PartialAPIInvite(invite)));
		},
		{
			detail: {
				tags,
				summary: 'Get team pending invites',
				description: 'Requires canManageMembers permission to get all invites, otherwise only returns invites created by the current user'
			},
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.post('/team/:namespace/invite', 
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can make invites
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canInviteMembers) throw new NotAuthorizedError();

			// Check permissions to see what permissions we can give
			if (
				((context.body.canManageTemplates ?? false) == true && !member.canManageTemplates)
				|| ((context.body.canManageLinks ?? false) == true && !member.canManageLinks)
				|| ((context.body.canManageRelationships ?? false) == true && !member.canManageRelationships)
				|| ((context.body.canInviteMembers ?? false) == true && !member.canInviteMembers)
				|| ((context.body.canManageMembers ?? false) == true && !member.canManageMembers)
				|| ((context.body.canEditTeam ?? false) == true && !member.canEditTeam)
			) throw new NotAuthorizedError();

			// Create invite
			const invite = await db.insert(schema.invites).values({
				teamId: team.id,
				inviterId: session.user.id,

				canManageTemplates: context.body.canManageTemplates ?? false,
				canManageLinks: context.body.canManageLinks ?? false,
				canManageRelationships: context.body.canManageRelationships ?? false,

				canInviteMembers: context.body.canInviteMembers ?? false,
				canManageMembers: context.body.canManageMembers ?? false,

				canEditTeam: context.body.canEditTeam ?? false
			}).returning();

			return Response.json(new APIInvite(invite[0]));
		},
		{
			detail: {
				tags,
				summary: 'Create a new invite'
			},
			params: t.Object({
				namespace: t.String()
			}),
			body: t.Partial(TeamMemberPermissions)
		}
	)
	.get('/team/:namespace/invite/:id', 
		async (context) => {
			// Fail fast if no key and no session
			const session = await getSession(context as unknown as Context); // FIXME: remove this "as unknown", seems to be some bug with types caused by having query in validation
			if (context.query.key == undefined && (!session || !session.user)) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get invite
			const invite = await db.query.invites.findFirst({
				where: eq(schema.invites.id, context.params.id)
			});
			if (invite == undefined) {
				// Don't leak that the invite doesn't exist
				// (Use the correct error that you would get if the invite did exist)
				if (!session || !session.user) throw new NotAuthenticatedError();

				throw new NotAuthorizedError();
			};

			// Check for key
			if (context.query.key != invite.key) {
				// Check for session
				if (!session || !session.user) throw new NotAuthenticatedError();

				// Check if we created the invite
				if (session.user.id != invite.inviterId) {
					// Check permissions
					const member = await db.query.teamMembers.findFirst({
						where: and(
							eq(schema.teamMembers.teamId, team.id),
							eq(schema.teamMembers.userId, session.user.id)
						)
					});
					if (member == undefined || !member.canManageMembers) throw new NotAuthorizedError();
				}
			}

			// Return invite
			return Response.json(new PartialAPIInvite(invite));
		},
		{
			detail: {
				tags,
				summary: 'Get invite details',
				description: 'Requires either the canManageMembers permission or the correct key for the invite'
			},
			params: t.Object({
				namespace: t.String(),
				id: t.String()
			}),
			query: t.Object({
				key: t.Optional(t.String())
			})
		}
	)
	.patch('/team/:namespace/invite/:id', // TODO: should this be POST /team/:namespace/member...?
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();
			
			// Get invite
			const invite = await db.query.invites.findFirst({
				where: and(
					eq(schema.invites.teamId, team.id),
					eq(schema.invites.id, context.params.id)
				)
			});
			if (invite == undefined) throw new NotAuthorizedError(); // Don't leak if invites exist or not

			// Check key
			if (context.body.key != invite.key) throw new NotAuthorizedError();

			// Add to team
			const member = await db.insert(schema.teamMembers).values({
				teamId: team.id,
				userId: session.user.id,

				canManageTemplates: invite.canManageMembers,
				canManageLinks: invite.canManageLinks,
				canManageRelationships: invite.canManageRelationships,

				canInviteMembers: invite.canInviteMembers,
				canManageMembers: invite.canManageMembers,

				canEditTeam: invite.canEditTeam
			}).returning().catch((err) => {
				if (err instanceof SQLiteError) {
					if (err.code == 'SQLITE_CONSTRAINT_PRIMARYKEY') {
						throw new AlreadyExistsError('MEMBER');
					}
				}
				throw err;
			});

			await db.delete(schema.invites).where(eq(schema.invites.id, invite.id));

			const user = await db.query.users.findFirst({
				where: eq(schema.users.id, session.user.id)
			});
			if (user == undefined) throw new KnownInternalServerError({
				detail: 'Team member created after accepting invite does not have a corresponding user',
				user, member, invite, team
			});

			return Response.json(new APITeamMember(member[0], new APIUser(user)));
		},
		{
			detail: { tags, summary: 'Accept an invite' },
			params: t.Object({
				namespace: t.String(),
				id: t.String()
			}),
			body: t.Object({
				key: t.String()
			})
		}
	)
	.delete('/team/:namespace/invite/:id', 
		async (context) => {
			// Fail fast if no key and no session
			const session = await getSession(context as Context);
			if (context.body.key == undefined && (!session || !session.user)) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get invite
			const invite = await db.query.invites.findFirst({
				where: eq(schema.invites.id, context.params.id)
			});
			if (invite == undefined) {
				// Don't leak that the invite doesn't exist
				// (Use the correct error that you would get if the invite did exist)
				if (!session || !session.user) throw new NotAuthenticatedError();

				throw new NotAuthorizedError();
			};

			// Check for key
			if (context.body.key != invite.key) {
				// Check for session
				if (!session || !session.user) throw new NotAuthenticatedError();

				// Check if we created the invite
				if (session.user.id != invite.inviterId) {
					// Check permissions
					const member = await db.query.teamMembers.findFirst({
						where: and(
							eq(schema.teamMembers.teamId, team.id),
							eq(schema.teamMembers.userId, session.user.id)
						)
					});
					if (member == undefined || !member.canManageMembers) throw new NotAuthorizedError();
				}
			}

			// Delete invite
			return await db.delete(schema.invites).where(eq(schema.invites.id, invite.id));
		},
		{
			detail: {
				tags,
				summary: 'Revoke or decline an invite',
				description: 'This requires you to either have created the invite, to have its key, or to have canManageMembers permission'
			},
			params: t.Object({
				namespace: t.String(),
				id: t.String()
			}),
			body: t.Object({
				key: t.Optional(t.String())
			})
		}
	)
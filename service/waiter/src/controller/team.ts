import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, NotFoundError, t } from 'elysia';
import { AlreadyExistsError, NotAuthenticatedError, NotImplementedError, ResourceNotFoundError } from '~/types';
import db from '~/instance/database';
import { teams, teamMembers } from '~/instance/database/schema';
import { InferSelectModel, like } from 'drizzle-orm';
import { getSession } from '~/instance/auth';
import { SQLiteError } from 'bun:sqlite';

class APITeam {
	id: string;
	namespace: string;

	displayName: string;
	description: string;

	members: string[];

	createdAt: Date;

	constructor(team: InferSelectModel<typeof teams>, members: InferSelectModel<typeof teamMembers>[]) {
		this.id = team.id;
		this.namespace = team.namespace;
		this.displayName = team.displayName;
		this.description = team.description;
		this.createdAt = team.createdAt;

		this.members = members.map(m => m.userId);
	}
}

export default new Elysia()
	.post('/team/:namespace',
		async (context) => {
			const session = await getSession(context as Context);
			if (!session || !session.user) {
				throw new NotAuthenticatedError();
			} else {
				const team = await db.insert(teams).values({
					namespace: context.params.namespace,
					displayName: context.body.displayName,
					description: context.body.description
				}).returning().catch((err) => {
					if (err instanceof SQLiteError) {
						if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
							throw new AlreadyExistsError('namespace');
						}
					}
					throw err;
				});

				const members = await db.insert(teamMembers).values({
					teamId: team[0].id,
					userId: session.user.id
				}).returning();

				return Response.json(new APITeam(team[0], members));
			}
		},
		{
			detail: { description: 'Create a new team' },
			params: t.Object({
				namespace: t.String({
					minLength: 2,
					maxLength: 16,
					pattern: '^[a-zA-Z0-9]+$' // TODO: Add this regex too somehow idk how to combine regexes lol ^(user|new|api|home|account|pxls|admin)$
				}),
			}),
			body: t.Object({
				displayName: t.String({
					minLength: 1,
					maxLength: 32
				}),
				description: t.String({
					maxLength: 500
				})
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
			return Response.json(new APITeam(team, members));
		},
		{
			detail: { description: 'Get team details' },
			params: t.Object({
				namespace: t.String()
			})
		}
	)
	.put('/team/:namespace', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update team details' } }
	)
	.delete('/team/:namespace', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete a team' } }
	)
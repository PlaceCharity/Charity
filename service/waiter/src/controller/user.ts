import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, NotFoundError, t } from 'elysia';
import { getSession } from '~/instance/auth';
import { Account, User } from '@auth/core/types';
import db from '~/instance/database';
import { users } from '~/instance/database/schema';
import { InferSelectModel, like } from 'drizzle-orm';
import { NotAuthenticatedError, NotImplementedError } from '~/types';

class APIUser {
	id: string;
	name: string;
	image: string;

	constructor(user: User | InferSelectModel<typeof users>) {
		if (user.id == undefined) throw new InternalServerError() // Can't create API user from user with no ID
		this.id = user.id;
		this.name = user.name ?? 'Unnamed user';
		this.image = user.image ?? '';
	}
}

export default new Elysia()
	.put('/user', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update currently authenticated user details' } }
	)
	.delete('/user/:id', 
		() => { throw new NotImplementedError() },
		{
			detail: { description: 'Delete a user\nUse `@me` as the ID to delete the currently authenticated user' },
			params: t.Object({
				id: t.String()
			})
		}
	)
	.get('/user/:id', 
		async (context) => {
			if (context.params.id == '@me') {
				// Get currently authenticated user
				const session = await getSession(context as Context);
				if (!session || !session.user) {
					throw new NotAuthenticatedError();
				} else {
					// TODO: Remove this workaround, see https://github.com/elysiajs/elysia/issues/513#issuecomment-2021250942
					// also see https://discord.com/channels/1044804142461362206/1243512073145811004
					return Response.json(new APIUser(session.user));
				}
			} else {
				// Get user by ID
				const user = await db.query.users.findFirst({
					where: like(users.id, context.params.id)
				});
				if (user == undefined) throw new NotFoundError();
				return { ...new APIUser(user) } as APIUser;
			}
		},
		{ 
			detail: { description: 'Get user details\nUse `@me` as the ID to get the currently authenticated user' },
			params: t.Object({
				id: t.String()
			})
		}
	)

export { APIUser };
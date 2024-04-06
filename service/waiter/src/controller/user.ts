import { env } from '~/util/env';
import { Context, Elysia, NotFoundError, t } from 'elysia';
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
		this.id = user.id!;
		this.name = user.name ?? 'Unnamed user';
		this.image = user.image ?? '';
	}
}

export default new Elysia()
	.post('/user', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update currently authenticated user details' } }
	)
	.delete('/user', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete currently authenticated user' } }
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
					return { ...new APIUser(
						session.user
					) } as APIUser;
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
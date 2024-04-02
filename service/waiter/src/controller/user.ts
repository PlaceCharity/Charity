import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { getSession } from '~/instance/auth';
import { Account, User } from '@auth/core/types';
import db from '~/instance/database';
import { accounts as Accounts } from '~/instance/database/schema';
import { InferSelectModel, like } from 'drizzle-orm';
import { NotAuthenticatedError } from '~/types';

class APIUser {
	id: string;
	name: string;
	image: string;

	constructor(user: User) {
		this.id = user.id!;
		this.name = user.name ?? 'Unnamed user';
		this.image = user.image ?? '';
	}
}

export default new Elysia()
	.post('/user', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Update currently authenticated user details' } }
	)
	.delete('/user', 
		() => { throw new Error('Not implemented') },
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
				throw new Error('Not implemented')
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
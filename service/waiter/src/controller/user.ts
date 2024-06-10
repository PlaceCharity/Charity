import { env } from '~/util/env';
import { Context, Elysia, InternalServerError, NotFoundError, t } from 'elysia';
import { getSession } from '~/instance/auth';
import { Account, User } from '@auth/core/types';
import db from '~/instance/database';
import { users } from '~/instance/database/schema';
import { InferSelectModel, like } from 'drizzle-orm';
import { NotAuthenticatedError, NotImplementedError, ResourceNotFoundError } from '~/types';

export class APIUser {
	id: string;
	name: string;
	image: string;

	createdAt: Date;

	constructor(user: InferSelectModel<typeof users>) {
		this.id = user.id;
		this.name = user.name ?? 'Unnamed user';
		this.image = user.image ?? '';

		this.createdAt = user.createdAt;
	}
}

export default new Elysia()
	.put('/user', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Update currently authenticated user details' } }
	)
	.delete('/user/:id', 
		() => { throw new NotImplementedError() },
		{
			detail: { summary: 'Delete a user', description: 'Use `@me` as the ID to delete the currently authenticated user' },
			params: t.Object({
				id: t.String()
			})
		}
	)
	.get('/user/:id', 
		async (context) => {
			let id = context.params.id;

			if (context.params.id == '@me') {
				// Get currently authenticated user
				const session = await getSession(context as Context);
				if (!session || !session.user) {
					throw new NotAuthenticatedError();
				} else {
					id = session.user.id;
				}
			}

			// Get user by ID
			const user = await db.query.users.findFirst({
				where: like(users.id, id)
			});
			if (user == undefined) throw new ResourceNotFoundError();
			return Response.json(new APIUser(user));
		},
		{ 
			detail: { summary: 'Get user details', description: 'Use `@me` as the ID to get the currently authenticated user' },
			params: t.Object({
				id: t.String()
			})
		}
	)
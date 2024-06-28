import { env } from '~/instance/env';
import { Context, Elysia, NotFoundError, t } from 'elysia';
import { getSession } from '~/instance/auth';
import { Account, User } from '@auth/core/types';
import db from '~/instance/database';
import * as schema from '~/instance/database/schema';
import { InferSelectModel, eq } from 'drizzle-orm';
import { NotAuthenticatedError, NotImplementedError, ResourceNotFoundError } from '~/types';

const tags = ['user'];

export class APIUser {
	id: string;
	name: string;
	image: string;

	createdAt: Date;

	constructor(user: InferSelectModel<typeof schema.users>) {
		this.id = user.id;
		this.name = user.name ?? 'Unnamed user';
		this.image = user.image ?? '';

		this.createdAt = user.createdAt;
	}
}

export default new Elysia()
	.patch('/user/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Update user details', description: 'Use `@me` as the ID to update the currently authenticated user' } }
	)
	.delete('/user/:id', 
		() => { throw new NotImplementedError() },
		{
			detail: { tags, summary: 'Delete a user', description: 'Use `@me` as the ID to delete the currently authenticated user' },
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
				if (!session || !session.user) throw new NotAuthenticatedError();
				
				id = session.user.id;
			}

			// Get user by ID
			const user = await db.query.users.findFirst({
				where: eq(schema.users.id, id)
			});
			if (user == undefined) throw new ResourceNotFoundError();
			return Response.json(new APIUser(user));
		},
		{ 
			detail: { tags, summary: 'Get user details', description: 'Use `@me` as the ID to get the currently authenticated user' },
			params: t.Object({
				id: t.String()
			})
		}
	)
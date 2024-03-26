import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { getSession } from '~/instance/auth';

export default new Elysia()
	.get('/user/@me', 
		async (context) => { 
			const session = await getSession(context);
			if (!session.user) {
				context.set.status = 401;
				return new Error('Not authenticated');
			} else {
				return session.user;
			}
		},
		{ detail: { description: 'Get currently authenticated user details' } }
	)
	.post('/user/@me', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Update currently authenticated user details' } }
	)
	.delete('/user/@me', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Delete currently authenticated user' } }
	)
	.get('/user/:id', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Get user details' } }
	)
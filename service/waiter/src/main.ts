import { env } from '~/util/env';

// Elysia imports
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Our imports
import { NotImplementedError, NotAuthenticatedError } from './types';
import auth from './instance/auth';
import user from './controller/user';
import team from './controller/team';
import template from './controller/template';
import link from './controller/link';

// Set up Elysia and listen
export const app = new Elysia()
    .use(swagger({ provider: 'scalar' }))
	.error({ NOT_IMPLEMENTED: NotImplementedError, NOT_AUTHENTICATED: NotAuthenticatedError })
	.onError(({ code }) => code) // Just return the error code
	.get('/', () => '🍽️ Waiter is running (see /swagger)')
	.use(auth)
	.use(user)
    .use(team)
	.use(template)
	.use(link)
	.listen(env.PORT);

console.log(`🍽️ Waiter is running at ${app.server?.hostname}:${app.server?.port} with base URL ${env.BASE_URL}`);

// Export the app for Eden client
export type Waiter = typeof app;
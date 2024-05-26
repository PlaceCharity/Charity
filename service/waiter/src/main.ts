import { env } from '~/util/env';

// Elysia imports
import { Elysia, ValidationError } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Our imports
import { NotImplementedError, NotAuthenticatedError, ResourceNotFoundError, AlreadyExistsError } from './types';
import auth from './instance/auth';
import user from './controller/user';
import team from './controller/team';
import template from './controller/template';
import link from './controller/link';

// Set up Elysia and listen
export const app = new Elysia()
    .use(swagger({ provider: 'scalar' }))
	.error({
		[new NotImplementedError().message]: NotImplementedError,
		[new NotAuthenticatedError().message]: NotAuthenticatedError,
		[new ResourceNotFoundError().message]: ResourceNotFoundError,
		[new AlreadyExistsError('Example').message]: AlreadyExistsError
	})
	.onError(
		({ code, error }): { code: string } | { code: string, details: ValidationError | string } => {
		if (code == 'VALIDATION') return { code, details: JSON.parse(error.message) };
		if (code == 'ALREADY_EXISTS') return { code, details: error.details };
		return { code };
	}) // Just return the error code
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
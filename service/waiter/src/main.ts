import { env } from '~/util/env';

// Elysia imports
import { Elysia, ValidationError } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Our imports
import { NotImplementedError, NotAuthenticatedError, ResourceNotFoundError, AlreadyExistsError, NotAuthorizedError, BadRequestError } from './types';
import auth from './instance/auth';
import UserController from './controller/user';
import TeamController from './controller/team';

// Set up Elysia and listen
export const app = new Elysia()
    .use(swagger({ provider: 'scalar' }))
	.error({
		[new NotImplementedError().message]: NotImplementedError,
		[new NotAuthenticatedError().message]: NotAuthenticatedError,
		[new NotAuthorizedError().message]: NotAuthorizedError,
		[new BadRequestError().message]: BadRequestError,
		[new ResourceNotFoundError().message]: ResourceNotFoundError,
		[new AlreadyExistsError('Example').message]: AlreadyExistsError
	})
	.onError(({ code, error }): { code: string } | { code: string, details: ValidationError | string } => {
		console.debug(`[DEBUG] ${code}\n`, error);
		if (code == 'VALIDATION') return { code, details: JSON.parse(error.message) };
		if (code == 'ALREADY_EXISTS') return { code, details: error.details };
		return { code };
	})
	.get('/', () => '🍽️ Waiter is running (see /swagger)')
	.use(auth)
	.use(UserController)
    .use(TeamController)
	.listen(env.PORT);

console.log(`🍽️ Waiter is running at ${app.server?.hostname}:${app.server?.port} with base URL ${env.BASE_URL}`);

// Export the app for Eden client
export type Waiter = typeof app;
export * from './types';
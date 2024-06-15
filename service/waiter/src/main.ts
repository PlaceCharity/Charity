import { env } from '~/util/env';
import packageJson from '../package.json';

// Elysia imports
import { Elysia, ValidationError } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Our imports
import { NotImplementedError, NotAuthenticatedError, ResourceNotFoundError, AlreadyExistsError, NotAuthorizedError, BadRequestError, KnownInternalServerError } from './types';
import auth from './instance/auth';
import FileController from './controller/file';
import UserController from './controller/user';
import TeamController from './controller/team';

// Set up Elysia and listen
export const app = new Elysia()
    .use(swagger({
		provider: 'scalar',
		documentation: {
			info: {
				title: 'Waiter Documentation',
				version: packageJson.version
			},
			tags: [
				{ name: 'user' },
				{ name: 'team' },
				{ name: 'team/link' },
				{ name: 'team/invite' },
				{ name: 'team/template' },
				{ name: 'team/template/entry' },
			]
		}
	}))
	.error({
		[new NotImplementedError().message]: NotImplementedError,
		[new NotAuthenticatedError().message]: NotAuthenticatedError,
		[new NotAuthorizedError().message]: NotAuthorizedError,
		[new BadRequestError().message]: BadRequestError,
		[new ResourceNotFoundError().message]: ResourceNotFoundError,
		[new AlreadyExistsError('Example').message]: AlreadyExistsError,
		[new KnownInternalServerError({}).message]: KnownInternalServerError
	})
	.onError(({ code, error }): { code: string } | { code: string, details: ValidationError | string } => {
		// Log errors by severity
		// TODO: replace this with some log storage thing
		if (['NOT_IMPLEMENTED', 'NOT_AUTHENTICATED', 'NOT_AUTHORIZED', 'BAD_REQUEST', 'RESOURCE_NOT_FOUND', 'ALREADY_EXISTS'].includes(code)) {
			// User error
			console.debug(error);
		} else {
			// Internal error
			console.error(error);
		}
		
		if (code == 'VALIDATION') return { code, details: JSON.parse(error.message) };
		if (code == 'ALREADY_EXISTS') return { code, details: error.details };

		return { code };
	})
	.get('/', () => '🍽️ Waiter is running (see /swagger)')
	.use(auth)
	.use(FileController)
	.use(UserController)
    .use(TeamController)
	.listen(env.PORT);

console.log(`🍽️ Waiter is running at ${app.server?.hostname}:${app.server?.port} with base URL ${env.BASE_URL}`);

// Export the app for Eden client
export type Waiter = typeof app;

// Rest of the exports
export {
	// Errors
	NotImplementedError, NotAuthenticatedError, NotAuthorizedError, BadRequestError, ResourceNotFoundError, AlreadyExistsError
} from './types';
export { APIUser } from '~/controller/user';
export { APITeam } from '~/controller/team';
export { APITeamMember } from '~/controller/team/member';
export { PartialAPIInvite, APIInvite } from '~/controller/team/invite';
export { APILink } from '~/controller/team/link';
export { APITemplate } from '~/controller/team/template';
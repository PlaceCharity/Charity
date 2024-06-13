import { env } from '~/util/env';
import packageJson from '../package.json';

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
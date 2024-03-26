import { env } from '~/util/env';

// Elysia imports
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Our imports
import auth from './instance/auth';
import user from './controller/user';
import team from './controller/team';
import template from './controller/template';
import link from './controller/link';

const app = new Elysia()
    .use(swagger({ provider: 'scalar' }))
	.get('/', () => '🍽️ Waiter is running (see /swagger)')
	.use(auth)
	.use(user)
    .use(team)
	.use(template)
	.use(link)
	.listen(env.PORT);

console.log(`🍽️ Waiter is running at ${app.server?.hostname}:${app.server?.port} with base URL ${env.BASE_URL}`);
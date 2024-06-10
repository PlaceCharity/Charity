import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

export default new Elysia()
	.get('/team/:namespace/template/:slug/entry', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Get template entries' } }
	)
	.post('/team/:namespace/template/:slug/entry', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Create a new entry' } }
	)
	.get('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Get entry details' } }
	)
	.put('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Update entry details' } }
	)
	.delete('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Delete an entry' } }
	)
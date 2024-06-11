import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

const tags = ['team/template/entry'];

export default new Elysia()
	.get('/team/:namespace/template/:slug/entry', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Get template entries' } }
	)
	.post('/team/:namespace/template/:slug/entry', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Create a new entry' } }
	)
	.get('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Get entry details' } }
	)
	.put('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Update entry details' } }
	)
	.delete('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Delete an entry' } }
	)
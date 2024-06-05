import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

export default new Elysia()
	.get('/team/:namespace/template', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Get team templates' } }
	)
	.post('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Create a new template' } }
	)
	.get('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Get template details' } }
	)
	.put('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Update template details' } }
	)
	.delete('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Delete a template' } }
	)
import { env } from '~/util/env';
import { Elysia } from 'elysia';

export default new Elysia()
	.get('/team/:namespace/link', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Get team templates' } }
	)
	.post('/team/:namespace/link', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Create a new template' } }
	)
	.get('/team/:namespace/link/:slug', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Get template details' } }
	)
	.post('/team/:namespace/link/:slug', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Update template details' } }
	)
	.delete('/team/:namespace/link/:slug', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Delete a template' } }
	)
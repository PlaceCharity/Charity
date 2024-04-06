import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

export default new Elysia()
	.get('/team/:namespace/link', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Get team templates' } }
	)
	.post('/team/:namespace/link', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Create a new template' } }
	)
	.get('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Get template details' } }
	)
	.post('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update template details' } }
	)
	.delete('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete a template' } }
	)
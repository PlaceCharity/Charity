import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

export default new Elysia()
	.get('/team/:namespace/link', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Get team links' } }
	)
	.post('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Create a new link' } }
	)
	.get('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Get link details' } }
	)
	.put('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update link details' } }
	)
	.delete('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete a link' } }
	)
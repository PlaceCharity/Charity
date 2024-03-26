import { env } from '~/util/env';
import { Elysia } from 'elysia';

export default new Elysia()
	.post('/team', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Create a new team' } }
	)
	.get('/team/:namespace', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Get team details' } }
	)
	.post('/team/:namespace', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Update team details' } }
	)
	.delete('/team/:namespace', 
		() => { throw new Error('Not implemented') },
		{ detail: { description: 'Delete a team' } }
	)
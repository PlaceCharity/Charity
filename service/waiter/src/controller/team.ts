import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

export default new Elysia()
	.post('/team', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Create a new team' } }
	)
	.get('/team/:namespace', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Get team details' } }
	)
	.put('/team/:namespace', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update team details' } }
	)
	.delete('/team/:namespace', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete a team' } }
	)
import { env } from '~/util/env';
import { Elysia } from 'elysia';
import { NotImplementedError } from '~/types';

import EntryController from './template/entry';

const tags = ['team/template'];

export default new Elysia()
	.use(EntryController)
	.get('/team/:namespace/template', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Get team templates' } }
	)
	.put('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Create a new template' } }
	)
	.get('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Get template details' } }
	)
	.patch('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Update template details' } }
	)
	.delete('/team/:namespace/template/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Delete a template' } }
	)
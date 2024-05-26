import { env } from '~/util/env';
import { Elysia, t } from 'elysia';
import { NotImplementedError, ResourceNotFoundError } from '~/types';
import db from '~/instance/database';
import { links, teams } from '~/instance/database/schema';
import { InferSelectModel, and, like } from 'drizzle-orm';

export class APILink {
	id: string;
	teamId: string;

	slug: string;
	url: string;
	text: string;

	createdAt: Date;

	constructor(link: InferSelectModel<typeof links>) {
		this.id = link.id;
		this.teamId = link.teamId;

		this.slug = link.slug;
		this.url = link.url;
		this.text = link.text;

		this.createdAt = link.createdAt;
	}
}

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
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: like(teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const link = await db.query.links.findFirst({
				// slug is context.params.slug and teamId is team.id
				where: and(
					like(links.teamId, team.id),
					like(links.slug, context.params.slug),
				)
			});
			if (link == undefined) throw new ResourceNotFoundError();

			return Response.json(new APILink(link));
		},
		{
			detail: { description: 'Get link details' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)
	.put('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Update link details' } }
	)
	.delete('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { description: 'Delete a link' } }
	)
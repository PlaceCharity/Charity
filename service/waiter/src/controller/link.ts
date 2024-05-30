import { env } from '~/util/env';
import { Elysia, t } from 'elysia';
import { AlreadyExistsError, NotImplementedError, ResourceNotFoundError } from '~/types';
import db from '~/instance/database';
import { links, teams } from '~/instance/database/schema';
import { InferSelectModel, and, like } from 'drizzle-orm';
import { SQLiteError } from 'bun:sqlite';

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
		{ detail: { summary: 'Get team links' } }
	)
	.post('/team/:namespace/link/:slug', 
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: like(teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const link = await db.insert(links).values({
				teamId: team.id,
				slug: context.params.slug,
				url: context.body.url,
				text: context.body.text
			}).returning().catch((err) => {
				if (err instanceof SQLiteError) {
					if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
						throw new AlreadyExistsError('link');
					}
				}
				throw err;
			});

			return Response.json(new APILink(link[0]));
		},
		{
			detail: { summary: 'Create a new link' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String({
					minLength: 1,
					maxLength: 32,
					pattern: '^[a-zA-Z0-9\-\_]+$'
				})
			}),
			body: t.Object({
				url: t.String({ format: 'uri' }),
				text: t.String({
					minLength: 1,
					maxLength: 32
				})
			})
		}
	)
	.get('/team/:namespace/link/:slug', 
		async (context) => {
			const team = await db.query.teams.findFirst({
				where: like(teams.namespace, context.params.namespace),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			const link = await db.query.links.findFirst({
				where: and(
					like(links.teamId, team.id),
					like(links.slug, context.params.slug),
				)
			});
			if (link == undefined) throw new ResourceNotFoundError();

			return Response.json(new APILink(link));
		},
		{
			detail: { summary: 'Get link details' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)
	.put('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Update link details' } }
	)
	.delete('/team/:namespace/link/:slug', 
		() => { throw new NotImplementedError() },
		{ detail: { summary: 'Delete a link' } }
	)
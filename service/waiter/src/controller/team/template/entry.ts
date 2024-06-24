import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { BadRequestError, KnownInternalServerError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, ResourceNotFoundError } from '~/types';
import { File } from '~/instance/files';
import * as schema from '~/instance/database/schema';
import { InferSelectModel, and, eq } from 'drizzle-orm';
import { getSession } from '~/instance/auth';
import db from '~/instance/database';
import files from '~/instance/files';
import { NotFound } from '@aws-sdk/client-s3';

const tags = ['team/template/entry'];

export const DisplayName = t.String({
	minLength: 1,
	maxLength: 128 // 2x template cause template will be shown as "Template (Team)"
});

export const Description = t.String({
	maxLength: 500
});

export const EntryBody = t.Object({
	displayName: DisplayName,
	description: Description,
	fileId: t.String(),
	positionX: t.Integer(),
	positionY: t.Integer()
});

export class APIEntry {
	id: string;
	templateId: string;

	displayName: string;
	file: string;

	positionX: number;
	positionY: number;

	description: string;
	createdAt: Date;

	constructor(entry: InferSelectModel<typeof schema.entries>, file: File | string) {
		this.id = entry.id;
		this.templateId = entry.templateId;
		this.displayName = entry.displayName;
		this.positionX = entry.positionX;
		this.positionY = entry.positionY;
		this.description = entry.description;
		this.createdAt = entry.createdAt;

		this.file = file instanceof File ? this.file = file.getPublicUrl().toString() : file;
	}
}

export default new Elysia()
	.get('/team/:namespace/template/:slug/entries', 
		async (context) => {
			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get slug
			const slug = await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug.toLowerCase())
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();

			// Get template
			const template = await db.query.templates.findFirst({
				where: eq(schema.templates.id, slug.templateId)
			});
			if (template == undefined) throw new KnownInternalServerError({
				message: 'Slug with templateId but with no corresponding template',
				team, slug, template
			});

			// Get entries
			const entries = await db.query.entries.findMany({
				where: eq(schema.entries.templateId, template.id)
			});

			// Return them with their file url
			return await Promise.all(entries.map(async entry => new APIEntry(entry, entry.fileId != undefined ? await files.get(entry.fileId) ?? '' : '')));
		},
		{
			detail: { tags, summary: 'Get template entries' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			})
		}
	)
	.post('/team/:namespace/template/:slug/entry', 
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get slug
			const slug = await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug.toLowerCase())
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();

			// Get template
			const template = await db.query.templates.findFirst({
				where: eq(schema.templates.id, slug.templateId)
			});
			if (template == undefined) throw new KnownInternalServerError({
				message: 'Slug with templateId but with no corresponding template',
				team, slug, template
			});

			// Check permissions to see if we can create entries
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canManageTemplates) throw new NotAuthorizedError();

			// Check if the file is valid
			const file = await files.get(context.body.fileId);
			if (file == undefined) throw new BadRequestError(); // TODO: Better error for this?
			const head = await file.head().catch(err => {
				if (err instanceof NotFound) throw new BadRequestError();
				throw err;
			});
			if (head.ContentType != 'image/png') throw new BadRequestError();

			// Create entry
			const entry = await db.insert(schema.entries).values({
				templateId: template.id,
				displayName: context.body.displayName,
				description: context.body.description,
				fileId: file.id,
				positionX: context.body.positionX,
				positionY: context.body.positionY
			}).returning();

			return Response.json(new APIEntry(entry[0], file));
		},
		{
			detail: { tags, summary: 'Create a new entry' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String()
			}),
			body: EntryBody
		}
	)
	.get('/team/:namespace/template/:slug/entry/:id', 
		async (context) => {
			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase())
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get slug
			const slug = await db.query.slugs.findFirst({
				where: and(
					eq(schema.slugs.teamId, team.id),
					eq(schema.slugs.slug, context.params.slug.toLowerCase())
				)
			});
			if (slug == undefined || slug.templateId == undefined) throw new ResourceNotFoundError();

			// Get entry
			const entry = await db.query.entries.findFirst({
				where: and(
					eq(schema.entries.templateId, slug.templateId),
					eq(schema.entries.id, context.params.id)
				)
			});
			if (entry == undefined) throw new ResourceNotFoundError();

			// Get file
			const file = entry.fileId != null ? await files.get(entry.fileId) ?? '' : '';

			return Response.json(new APIEntry(entry, file));
		},
		{
			detail: { tags, summary: 'Get entry details' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String(),
				id: t.String()
			})
		}
	)
	.patch('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{
			detail: { tags, summary: 'Update entry details' },
			params: t.Object({
				namespace: t.String(),
				slug: t.String(),
				id: t.String()
			}),
			body: t.Partial(EntryBody)
		}
	)
	.delete('/team/:namespace/template/:slug/entry/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Delete an entry' } }
	)
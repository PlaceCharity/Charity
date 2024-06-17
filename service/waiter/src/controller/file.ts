import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { NotAuthenticatedError, NotImplementedError } from '~/types';
import * as schema from '~/instance/database/schema';
import db from '~/instance/database';
import files from '~/instance/files';
import { getSession } from '~/instance/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const tags = ['file'];

export default new Elysia()
	.post('/file', 
		async (context) => {
			// Get session and create file ID
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();
			
			const file = await db.insert(schema.files).values({}).returning();

			// Create file upload ticket
			const command = new PutObjectCommand({
				Bucket: files.bucket,
				Key: file[0].id,
				ContentLength: context.body.contentLength,
				ContentType: context.body.contentType
			});

			const ticket = await getSignedUrl(files.s3, command, {
				expiresIn: 300,
				signableHeaders: new Set(['content-length', 'content-type'])
			});

			return Response.json({
				id: file[0].id,
				ticket
			});
		},
		{
			detail: { tags, summary: 'Create a file upload ticket' },
			body: t.Object({
				contentLength: t.Integer({
					minimum: 1,
					maximum: 1024 /* bytes */ * 1024 /* kibibytes */ * 10 /* mebibytes */
				}),
				contentType: t.Union([
					t.Literal('image/png')
				])
			})
		}
	)
	.delete('/file/:id', 
		() => { throw new NotImplementedError() },
		{ 
			detail: { 
				tags, summary: 'Delete a file', 
				description: 'You can only delete files that aren\'t referenced anywhere — if they are, you should delete the resource that is referencing them' 
			}
		}
	)
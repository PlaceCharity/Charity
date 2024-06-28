import { env } from '~/instance/env';
import { HeadObjectCommand, S3, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { NotImplementedError } from '~/types';
import { InferSelectModel, count, eq } from 'drizzle-orm';
import * as schema from '~/instance/database/schema';
import db from '~/instance/database';

export class File implements InferSelectModel<typeof schema.files> {
	id: string;

	uploaderId: string | null;
	parent: Files;

	createdAt: Date;

	constructor(dbFile: InferSelectModel<typeof schema.files>, parent: Files) {
		this.id = dbFile.id;
		this.uploaderId = dbFile.uploaderId;
		this.createdAt = dbFile.createdAt;

		this.parent = parent;
	}

	/* async */ head() {
		return this.parent.s3.send(new HeadObjectCommand({
			Bucket: this.parent.bucket,
			Key: this.id
		}));
	}

	getPublicUrl() {
		return this.parent.publicBase + this.id;
	}

	async getReferenceCount() {
		return (
			(await db.select({ count: count() }).from(schema.entries).where(eq(schema.entries.fileId, this.id)))[0].count
			// + (await ...)[0].count
		)
	}
}

export class Files {
	s3: S3Client;
	bucket: string;
	publicBase: string;

	constructor(clientConfig: S3ClientConfig, bucket: string, publicBase: string) {
		this.s3 = new S3Client(clientConfig);
		this.bucket = bucket;
		this.publicBase = publicBase;
	}

	async get(id: string) {
		const dbFile = await db.query.files.findFirst({
			where: eq(schema.files.id, id)
		});
		if (dbFile == undefined) return undefined;

		return new File(dbFile, this);
	}
}

export default new Files({
	region: env.S3_REGION,
	endpoint: env.S3_ENDPOINT,
	credentials: {
		accessKeyId: env.S3_ACCESSKEY_ID,
		secretAccessKey: env.S3_ACCESSKEY_SECRET
	}
}, env.S3_BUCKET, env.S3_PUBLIC_BASE);
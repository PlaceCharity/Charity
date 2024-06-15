import { env } from '~/util/env';
import { S3, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { NotImplementedError } from '~/types';
import { InferSelectModel } from 'drizzle-orm';
import { files } from './database/schema';

export class Files {
	s3: S3Client;
	bucket: string;
	publicBase: string;

	constructor(clientConfig: S3ClientConfig, bucket: string, publicBase: string) {
		this.s3 = new S3Client(clientConfig);
		this.bucket = bucket;
		this.publicBase = publicBase;
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
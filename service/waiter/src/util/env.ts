import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

// Bun reads, in order of increasing precedence: .env, .env.production | .env.development, .env.local
// https://bun.sh/guides/runtime/set-env

export const env = createEnv({
	server: {
		PORT: z.coerce.number().int().min(1).max(65535),
		BASE_URL: z.string().url(),
		S3_PUBLIC_BASE: z.string().url(),
		S3_REGION: z.string(),
		S3_ENDPOINT: z.string().url(),
		S3_BUCKET: z.string(),
		S3_ACCESSKEY_ID: z.string(),
		S3_ACCESSKEY_SECRET: z.string(),
		AUTH_SECRET: z.string().min(32),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string()
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true
});
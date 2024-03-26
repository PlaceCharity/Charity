import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

// Bun reads, in order of increasing precedence: .env, .env.production | .env.development, .env.local
// https://bun.sh/guides/runtime/set-env

export const env = createEnv({
	server: {
		PORT: z.coerce.number().int().min(1).max(65535),
		BASE_URL: z.string().url(),
		AUTH_SECRET: z.string().min(32),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string()
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true
});
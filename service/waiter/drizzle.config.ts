import type { Config } from 'drizzle-kit';

export default {
	schema: './src/instance/database/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite',
	dbCredentials: {
		url: './data/db.sqlite'
	}
} satisfies Config;
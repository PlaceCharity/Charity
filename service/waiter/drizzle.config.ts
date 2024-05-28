import type { Config } from 'drizzle-kit';

export default {
	dialect: 'sqlite',
	schema: './src/instance/database/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: './data/db.sqlite'
	}
} satisfies Config;
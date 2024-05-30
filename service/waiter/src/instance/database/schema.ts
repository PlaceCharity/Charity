// Schema
import { sqliteTable as table, text, integer, blob, primaryKey, unique } from 'drizzle-orm/sqlite-core';

// Auth.js stuff
import { AdapterAccount } from '@auth/core/adapters';
import { sql } from 'drizzle-orm';

// Etc
import { v4 as uuidv4 } from 'uuid';

export const accounts = table('account', {
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		}),
	})
);

export const sessions = table('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokens = table(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);

// Our stuff

export const users = table('user', {
	// This stuff is required for Auth.js
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image'),

	// Now for our stuff!

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const teams = table('team', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	namespace: text('namespace').notNull().unique(),

	displayName: text('displayName').notNull(),
	description: text('description').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const teamMembers = table('teamMember', {
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
	userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),

	canManageTemplates: integer('canManageTemplates', { mode: 'boolean' }).notNull().default(false),
	canInviteMembers: integer('canInviteMembers', { mode: 'boolean' }).notNull().default(false),
	canManageMembers: integer('canRemoveMembers', { mode: 'boolean' }).notNull().default(false),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (tm) => ({
	compoundKey: primaryKey({ columns: [ tm.teamId, tm.userId ] })
}));

export const links = table('link', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),

	slug: text('slug').notNull(),
	url: text('url').notNull(),
	text: text('text').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (links) => ({
	unique: unique().on(links.teamId, links.slug)
}));
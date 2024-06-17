// Schema
import { sqliteTable as table, text, integer, blob, primaryKey, unique, check, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

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

export const files = table('file', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),

	uploaderId: text('uploaderId').references(() => users.id, { onDelete: 'set default' }),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const teams = table('team', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	namespace: text('namespace').notNull().unique(),

	// Used in Overlay
	displayName: text('displayName').notNull(),
	contactInfo: text('contactInfo').notNull(),

	// Just for the site
	description: text('description').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (t) => ({
	index: uniqueIndex('teamNamespaceIndex').on(t.namespace)
}));

export const teamMembers = table('teamMember', {
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
	userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),

	canManageTemplates: integer('canManageTemplates', { mode: 'boolean' }).notNull().default(false),
	canManageLinks: integer('canManageLinks', { mode: 'boolean' }).notNull().default(false),

	canInviteMembers: integer('canInviteMembers', { mode: 'boolean' }).notNull().default(false),
	canManageMembers: integer('canManageMembers', { mode: 'boolean' }).notNull().default(false),

	canEditTeam: integer('canEditTeam', { mode: 'boolean' }).notNull().default(false),

	// Non-owners should have this column be *null*, not false! So that the unique constraint works properly
	isOwner: integer('isOwner', { mode: 'boolean' }),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (tm) => ({
	compoundKey: primaryKey({ columns: [ tm.teamId, tm.userId ] }),

	ownerConstraint: unique().on(tm.teamId, tm.isOwner)
}));

export const invites = table('invite', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	key: text('key').notNull().$default(() => uuidv4()),

	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
	inviterId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),

	canManageTemplates: integer('canManageTemplates', { mode: 'boolean' }).notNull().default(false),
	canManageLinks: integer('canManageLinks', { mode: 'boolean' }).notNull().default(false),

	canInviteMembers: integer('canInviteMembers', { mode: 'boolean' }).notNull().default(false),
	canManageMembers: integer('canManageMembers', { mode: 'boolean' }).notNull().default(false),

	canEditTeam: integer('canEditTeam', { mode: 'boolean' }).notNull().default(false),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const slugs = table('slug', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),

	slug: text('slug').notNull(),

	linkId: text('linkId').references(() => links.id, { onDelete: 'cascade' }),
	templateId: text('templateId').references(() => templates.id, { onDelete: 'cascade' }),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (s) => ({
	// FIXME: Right now, drizzle-kit doesn't support checks, but the ORM does, so we can define this and it will let us but it doesn't actually get used
	// https://github.com/drizzle-team/drizzle-orm/issues/880
	linkOrTemplateCheck: check('linkOrTemplateCheck', 
		sql`(linkId IS NOT NULL AND templateId IS NULL) OR (linkId IS NULL AND templateId IS NOT NULL)`
	),
	uniqueToTeam: unique().on(s.teamId, s.slug),

	index: uniqueIndex('teamSlugIndex').on(s.teamId, s.slug)
}));

export const links = table('link', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),

	url: text('url').notNull(),
	text: text('text').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const templates = table('template', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),

	// Used in overlay
	displayName: text('displayName').notNull(),

	// Just for the site
	description: text('description').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const entries = table('entry', {
	id: text('id').notNull().primaryKey().$default(() => uuidv4()),
	templateId: text('templateId').notNull().references(() => templates.id, { onDelete: 'cascade' }),

	// Used in overlay
	displayName: text('displayName').notNull(),
	fileId: text('fileId').references(() => files.id, { onDelete: 'set default' }),

	// Just for the site
	description: text('description').notNull(),

	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});
import { Auth, AuthConfig, createActionURL } from '@auth/core';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { Context, Elysia } from 'elysia';
import db from '~/instance/database';
import * as schema from '~/instance/database/schema';
import { env } from '~/util/env';
import DiscordProvider from '@auth/core/providers/discord';
import { eq } from 'drizzle-orm/sqlite-core/expressions';

export const authConfig: AuthConfig = {
	trustHost: true,
    secret: env.AUTH_SECRET,
	basePath: new URL('/auth', env.BASE_URL).pathname,
    adapter: DrizzleAdapter(db),
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
			authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds+email'
        })
    ],
	session: {
		strategy: 'database'
		// maxAge defaults to 30 days
	},
	pages: {
		// TODO: Add the frontend's pages here
	},
	callbacks: {
		session({ session, user }) {
			if (session?.user) session.user.id = user.id;
			return session;
		},
		// FIXME: This doesn't work, because user.id is ALWAYS a random one, and is never the actual database one. We encountered this in osuplace/link too.
		// Edit: Wait, actually no, since we're not using Prisma here... so I'm not sure? Maybe just add a query to see if the user exists first
		/*
		async signIn({ user, profile }) {
			// This is probably temporary since Auth.js will probably add this functionality themselves, but:
			// Update returning users' details
			if (user.id != undefined && profile != undefined) {
				try {
					await db.update(users)
						.set({ 
							name: profile.name,
							image: profile.image as string
						})
						.where(eq(users.id, user.id));
				} catch(err) {
					// We don't actually care about this error,
					// since it probably just means it's a new user.
					console.log('err',user.id,err);
				}
			}
			
			return true;
		}
		*/
	}
}

// Thanks to An-Ace https://github.com/An-Ace/elysiajs-authjs/blob/master/routes/auth/%5B...auth%5D.ts

export default new Elysia()
	.get('/auth/*', async ({ request }) => await Auth(request, authConfig))
	.post('/auth/*', async ({ headers, body, request }) => {
		const fetchHeaders = new Headers(headers as HeadersInit);
		fetchHeaders.set('Content-Type', 'application/json');
		return await Auth({
			...request,
			json: async () => body,
			// @ts-expect-error
			body: body,
			method: request.method,
			url: request.url,
			headers: fetchHeaders
		}, authConfig);
	});

// Reference: https://github.com/nextauthjs/next-auth/blob/11cfb0a3fbbe53b05609ff2c18937d6bc355c7d8/packages/frameworks-express/src/index.ts#L157
export async function getSession({ headers, request }: Context) {
	const url = createActionURL(
		'session',
		new URL(request.url).protocol.replace(':', ''),
		new Headers(headers as HeadersInit),
		process.env,
		authConfig.basePath
	);

	const response = await Auth(
		new Request(url, { headers: { cookie: headers.cookie ?? '' } } as RequestInit),
		authConfig
	);

	const { status = 200 } = response;

	const data = await response.json();

	if (!data || !Object.keys(data).length) return null;
	if (status == 200) return data;
	throw new Error(data.message);
}
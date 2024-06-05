import { describe, test, expect } from 'bun:test';

// Run waiter
import { app } from './main';

// Client
import { treaty } from '@elysiajs/eden';
import type { Waiter } from './main';
import { NotAuthenticatedError } from './types';
const client = treaty<Waiter>(app);

describe('waiter', () => {
	test('/user/@me should throw NotAuthenticatedError when not authenticated', async () => {
		const { data, error } = await client.user({ id: '@me' }).get();
		expect(error).not.toBeNull;
		expect(error!.value).toEqual({ code: 'NOT_AUTHENTICATED' });
	});
})
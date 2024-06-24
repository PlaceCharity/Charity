import { treaty } from '@elysiajs/eden';
import type { Waiter } from 'waiter';

// TODO: Configure this in .env
export const BASE_URL = 'http://localhost:3000';

export const client = treaty<Waiter>(BASE_URL);
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

const sqlite = new Database('./data/db.sqlite');
sqlite.exec("PRAGMA journal_mode = WAL;");
export default drizzle(sqlite, { schema });
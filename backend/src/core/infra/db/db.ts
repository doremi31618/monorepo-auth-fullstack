// import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { Pool } from 'pg';

export { schema };

export function createPool(connectionString: string){
	return new Pool({
		connectionString
	});
}
export function createDB(pool: Pool){
	return drizzle(pool, { schema });
}

export type DB = ReturnType<typeof createDB>;


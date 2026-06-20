import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool, PoolClient } from 'pg'
import * as schema from './schema'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  application_name: 'shoefit-app',
})

// Set search_path for all connections to find neon_auth schema tables
pool.on('connect', async (client: PoolClient) => {
  await client.query("SET search_path TO neon_auth, public")
})

// Configure Drizzle with schema
export const db = drizzle(pool, { schema })

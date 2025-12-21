import 'dotenv/config'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente del pool', err)
  process.exit(-1)
})

export const db = drizzle(pool, { schema })
export { pool }

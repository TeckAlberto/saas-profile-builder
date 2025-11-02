import dotenv from 'dotenv'
import { Pool, type QueryResult, type QueryResultRow } from 'pg'

// Carga las variables de entorno del archivo .env
dotenv.config()

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT)
})

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente del pool', err)
  process.exit(-1)
})

export default {
  query: <T extends QueryResultRow>(
    text: string,
    params?: (string | number | boolean)[]
  ): Promise<QueryResult<T>> => {
    // 2. Define el tipo de retorno
    // 3. Pasa el genérico <T> al pool.query real
    return pool.query<T>(text, params)
  }
}

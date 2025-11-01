import { Pool } from 'pg'
import dotenv from 'dotenv'

// Carga las variables de entorno del archivo .env
dotenv.config()

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) // Asegúrate de convertir el puerto a número
})

// Opcional: Manejador de errores del pool (esto sí estaba bien)
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente del pool', err)
  process.exit(-1)
})

/**
 * Exportamos un objeto con una única función 'query'.
 * Esta es una buena práctica que abstrae la lógica de conexión.
 * En lugar de que cada controlador tenga que hacer pool.connect() y client.release(),
 * simplemente llamarán a db.query(...) y listo.
 */
export default {
  query: (text: string, params?: any[]) => pool.query(text, params)
  // También puedes exportar el pool directamente si prefieres manejar
  // transacciones complejas, pero para un CRUD esto es más limpio:
  // pool: pool,
}

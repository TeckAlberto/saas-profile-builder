import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import db from '../../db'

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).send({ message: 'Email, username, and password are required' })
  }

  try {
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [
      email,
      username
    ])

    if (checkUser.rows.length > 0) {
      return res.status(409).send({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await db.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, plan',
      [email, username, hashedPassword]
    )

    if (result.rowCount === 0) {
      return res.status(500).send({ message: 'Error registering user' })
    }
    console.log('Registering user with email:', email, 'and username:', username)

    res.send(result.rows[0])
  } catch (error) {
    console.error('Error en el controlador de registro:', (error as Error).message)

    res.status(500).send({ message: 'Error interno del servidor' })
  }
}

export default register

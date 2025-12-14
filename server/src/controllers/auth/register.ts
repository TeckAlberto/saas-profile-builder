import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'

import { db } from '../../db'
import { users } from '../../db/schema'

interface RegisterRequestBody {
  email: string
  username: string
  password: string
}

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body as RegisterRequestBody

  if (!email || !username || !password) {
    return res.status(400).send({ message: 'Email, username, and password are required' })
  }

  try {
    const checkUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1)

    if (checkUser.length > 0) {
      return res.status(409).send({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await db
      .insert(users)
      .values({ email, username, passwordHash: hashedPassword })
      .returning({ id: users.id, email: users.email, username: users.username, plan: users.plan })

    if (result.length === 0) {
      return res.status(500).send({ message: 'Error registering user' })
    }
    console.log('Registering user with email:', email, 'and username:', username)

    res.status(201).send(result[0])
  } catch (error) {
    console.error('Error en el controlador de registro:', (error as Error).message)

    res.status(500).send({ message: 'Error interno del servidor' })
  }
}

export default register

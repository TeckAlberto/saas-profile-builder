import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import j from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

import { db } from '../../db'
import { users } from '../../db/schema'

interface LoginRequestBody {
  email: string
  password: string
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' })
  }

  try {
    const checkUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (checkUser.length < 1 || !checkUser[0]) {
      return res.status(404).send({ message: 'User not found' })
    }

    const user = checkUser[0]

    const rawPassword = await bcrypt.compare(password, user.passwordHash)

    if (!rawPassword) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    const token = j.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '2h'
    })

    res.status(200).send({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error in login controller:', (error as Error).message)

    res.status(500).send({ message: 'Internal server error' })
  }
}

export default login

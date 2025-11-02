import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import j from 'jsonwebtoken'

import db from '../../db'

interface LoginRequestBody {
  email: string
  password: string
}

interface UserFromDB {
  id: number
  email: string
  username: string
  password_hash: string
  plan: string
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' })
  }

  try {
    const checkUser = await db.query<UserFromDB>('SELECT * FROM users WHERE email = $1', [email])

    if (checkUser.rows.length < 1) {
      return res.status(404).send({ message: 'User not found' })
    }

    const user = checkUser.rows[0] as UserFromDB

    const rawPassword = await bcrypt.compare(password, user.password_hash)

    if (!rawPassword) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    const token = j.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    res.status(200).send({ message: 'Login successful', token })
  } catch (error) {
    console.error('Error in login controller:', (error as Error).message)

    res.status(500).send({ message: 'Internal server error' })
  }
}

export default login

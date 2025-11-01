import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import j from 'jsonwebtoken'
import db from '../../db'

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' })
  }

  try {
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if (checkUser.rows.length < 1) {
      return res.status(404).send({ message: 'User not found' })
    }

    const rawPassword = await bcrypt.compare(password, checkUser.rows[0].password_hash)

    if (!rawPassword) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    const token = j.sign({ userId: checkUser.rows[0].id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    res.send({ message: 'Login successful', token })
  } catch (error) {
    console.error('Error in login controller:', (error as Error).message)

    res.status(500).send({ message: 'Internal server error' })
  }
}

export default login

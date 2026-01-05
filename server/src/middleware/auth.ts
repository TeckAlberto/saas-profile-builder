import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  userId?: number
}

interface JwtPayload {
  userId: number
  iat: number
  exp: number
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    next()
    return
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload
    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error('JWT verification failed:', error)

    res.status(401).json({ message: 'Invalid token or token expired' })
  }
}

export type { AuthRequest }

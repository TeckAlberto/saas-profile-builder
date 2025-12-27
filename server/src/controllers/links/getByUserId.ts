import type { Response } from 'express'
import { eq, desc } from 'drizzle-orm'

import { db } from '../../db'
import { links } from '../../db/schema'
import type { AuthRequest } from '../../middleware/auth.middleware'

const getByUserId = async (req: AuthRequest, res: Response) => {
  console.log('Fetching links for userId:', req.userId)
  try {
    const userId = req.userId

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt))

    res.json(userLinks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching links' })
  }
}

export default getByUserId

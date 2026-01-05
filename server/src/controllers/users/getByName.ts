import type { Response, Request } from 'express'
import { asc, eq } from 'drizzle-orm'

import { db } from '../../db'
import { links, users } from '../../db/schema'

const getByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing name parameter' })
    }

    const usersFetched = await db.select().from(users).where(eq(users.username, name))

    if (!usersFetched[0]) {
      return res.status(404).json({ message: 'User not found' })
    }

    const linksFetched = await db
      .select()
      .from(links)
      .where(eq(links.userId, usersFetched[0].id))
      .orderBy(asc(links.order), asc(links.updatedAt))

    const response = {
      username: usersFetched[0].username,
      links: linksFetched
    }

    res.json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching user' })
  }
}

export default getByName

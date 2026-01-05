import type { Response } from 'express'
import { and, eq } from 'drizzle-orm'

import { db } from '../../db'
import { links } from '../../db/schema'
import type { AuthRequest } from '../../middleware/auth'

const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const { linkId } = req.params

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const link = await db
      .select()
      .from(links)
      .where(eq(links.id, Number(linkId)))

    if (link.length === 0) {
      return res.status(404).json({ message: 'Link not found' })
    }

    await db
      .delete(links)
      .where(and(eq(links.id, Number(linkId)), eq(links.userId, Number(userId))))

    res.status(200).json({ message: 'Link deleted successfully', link: link[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error deleting link' })
  }
}

export default deleteLink

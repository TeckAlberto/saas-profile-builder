import type { Response } from 'express'
import { and, eq } from 'drizzle-orm'

import type { AuthRequest } from '../../middleware/auth'
import { links } from '../../db/schema'
import { db } from '../../db'

interface OrderedLink {
  id: number
  order: number
}

const saveOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const { orderedLinkIds } = req.body as { orderedLinkIds: OrderedLink[] }

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const linksToUpdate = await db
      .select()
      .from(links)
      .where(eq(links.userId, Number(userId)))

    if (linksToUpdate.length !== orderedLinkIds.length) {
      return res.status(400).json({ message: 'Invalid link IDs' })
    }

    await db.transaction(async (tx) => {
      for (const { id, order } of orderedLinkIds) {
        await tx
          .update(links)
          .set({ order })
          .where(and(eq(links.id, id), eq(links.userId, Number(userId))))
      }
    })

    res.status(200).json({ message: 'Links order saved successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving links order' })
  }
}

export default saveOrder

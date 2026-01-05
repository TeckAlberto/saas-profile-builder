import type { Response } from 'express'

import { db } from '../../db'
import { links } from '../../db/schema'
import type { AuthRequest } from '../../middleware/auth'

interface CreateLinkBody {
  platform?: string
  url: string
  title: string
}

const create = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const { platform, url, title } = req.body as CreateLinkBody

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    if (!url || !title) {
      return res.status(400).json({ message: 'URL and Title are required' })
    }

    const newLink = await db
      .insert(links)
      .values({
        userId,
        platform: platform || 'custom',
        title,
        url,
        order: 0
      })
      .returning()

    res.status(201).json(newLink[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating link' })
  }
}

export default create

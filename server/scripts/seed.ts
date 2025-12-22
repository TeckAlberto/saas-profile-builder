import 'dotenv/config'
import bcrypt from 'bcryptjs'

import { db, pool } from '../src/db'
import { links, users } from '../src/db/schema'

const userSeeds = [
  { email: 'ada@example.com', username: 'ada', linkCount: 3 },
  { email: 'grace@example.com', username: 'grace', linkCount: 5 },
  { email: 'linus@example.com', username: 'linus', linkCount: 7 },
  { email: 'maria@example.com', username: 'maria', linkCount: 10 }
]

const seed = async () => {
  const passwordHash = await bcrypt.hash('password123', 10)

  await db.delete(links)
  await db.delete(users)

  for (const userSeed of userSeeds) {
    const [user] = await db
      .insert(users)
      .values({
        email: userSeed.email,
        username: userSeed.username,
        passwordHash
      })
      .returning({ id: users.id })

    if (!user) continue

    const userLinks = Array.from({ length: userSeed.linkCount }, (_, index) => ({
      title: `Link ${index + 1}`,
      url: `https://example.com/${userSeed.username}/${index + 1}`,
      userId: user.id
    }))

    await db.insert(links).values(userLinks)
  }
}

seed()
  .then(() => {
    console.log('Seed complete')
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })

import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import db from '@/db'
import { users, type User } from '@/db/schema'
import { redis } from '@/lib/redis'

import { getAuthSession } from './session'

export const getCurrentUser = async () => {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) return null

    const cachedCurrentUser = (await redis.hgetall(
      `user:${session.user.email}`
    )) as User

    const currentUser: User | undefined = cachedCurrentUser
      ? undefined
      : await db.query.users.findFirst({
          where: eq(users.email, session.user.email)
        })

    if (!currentUser && !cachedCurrentUser) return null

    const userId = currentUser?.id ?? cachedCurrentUser.id

    if (!currentUser?.username && !cachedCurrentUser.username) {
      await db
        .update(users)
        .set({ username: nanoid(10) })
        .where(eq(users.id, userId))
    }

    if (!cachedCurrentUser) {
      await redis.hset(`user:${session.user.email}`, currentUser!)
      await redis.expire(`user:${session.user.email}`, 60 * 60 * 6)
    }

    return currentUser ?? cachedCurrentUser
  } catch (error) {
    if (error instanceof Error) throw error
  }
}

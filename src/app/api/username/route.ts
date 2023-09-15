import { eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { users } from '@/db/schema'
import { redis } from '@/lib/redis'
import { UsernameValidator } from '@/lib/validators/username'
import { getCurrentUser } from '@/services/user'

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { name } = UsernameValidator.parse(body)

    const username = await db.query.users.findFirst({
      where: eq(users.username, name)
    })

    if (username) {
      return new Response('Username is taken', { status: 409 })
    }

    // Update username
    const [user] = await db
      .update(users)
      .set({ username: name })
      .where(eq(users.id, currentUser.id))
      .returning()

    await redis.hset(`user:${user?.email}`, user!)
    await redis.expire(`user:${user?.email}`, 60 * 60 * 6)

    return new Response('Username updated successfully.', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response('Could not update username, please try again later.', {
      status: 500
    })
  }
}

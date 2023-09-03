import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import db from '@/db'
import { users } from '@/db/schema'

import { getAuthSession } from './session'

export const getCurrentUser = async () => {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) return null

    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    })

    if (!currentUser) return null

    if (!currentUser.username) {
      await db
        .update(users)
        .set({ username: nanoid(10) })
        .where(eq(users.id, currentUser.id))
    }

    return currentUser
  } catch (error) {
    if (error instanceof Error) throw error
  }
}

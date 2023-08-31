import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import db from '@/db'
import { user } from '@/db/schema'

import { getAuthSession } from './session'

export const getCurrentUser = async () => {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) return null

    const currentUser = await db.query.user.findFirst({
      where: eq(user.email, session.user.email)
    })

    if (!currentUser) return null

    if (!currentUser.username) {
      await db
        .update(user)
        .set({ username: nanoid(10) })
        .where(eq(user.id, currentUser.id))
    }

    return currentUser
  } catch (error: any) {
    throw new Error(error)
  }
}

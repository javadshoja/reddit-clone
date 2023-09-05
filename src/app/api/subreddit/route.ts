import { eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { subreddits, subscriptions } from '@/db/schema'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { getCurrentUser } from '@/services/user'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorize', { status: 401 })
    }

    const body = await req.json()

    const { name } = SubredditValidator.parse(body)

    const subredditExists = await db.query.subreddits.findFirst({
      where: eq(subreddits.name, name)
    })

    if (subredditExists) {
      return new Response('Subreddit Already exists', { status: 409 })
    }

    const [newSubreddit] = await db
      .insert(subreddits)
      .values({ name, creatorId: currentUser.id })
      .returning()

    await db
      .insert(subscriptions)
      .values({ userId: currentUser.id, subredditId: newSubreddit!.id })

    return new Response(newSubreddit?.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create subreddit', { status: 500 })
  }
}

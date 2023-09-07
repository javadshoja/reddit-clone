import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { subreddits, subscriptions } from '@/db/schema'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { getCurrentUser } from '@/services/user'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { subredditId } = SubredditSubscriptionValidator.parse(body)

    const subredditId_userId = and(
      eq(subscriptions.subredditId, subredditId),
      eq(subscriptions.userId, currentUser.id)
    )

    const subscriptionExists = await db.query.subscriptions.findFirst({
      where: subredditId_userId
    })

    if (!subscriptionExists) {
      return new Response('You are not subscribed to this subreddit.', {
        status: 400
      })
    }

    const subreddit = await db.query.subreddits.findFirst({
      where: and(
        eq(subreddits.id, subredditId),
        eq(subreddits.creatorId, currentUser.id)
      )
    })

    if (subreddit) {
      return new Response('You cant unsubscribe from your own subreddit.', {
        status: 400
      })
    }

    await db.delete(subscriptions).where(subredditId_userId)

    return new Response(JSON.stringify(subredditId), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response('Could not unsubscribe please try again later', {
      status: 500
    })
  }
}

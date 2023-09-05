import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { subscriptions } from '@/db/schema'
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

    const subscriptionExists = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.subredditId, subredditId),
        eq(subscriptions.userId, currentUser.id)
      )
    })

    if (subscriptionExists) {
      return new Response('You are already subscribed to this subreddit.', {
        status: 400
      })
    }

    await db.insert(subscriptions).values({
      subredditId,
      userId: currentUser.id
    })

    return new Response(JSON.stringify(subredditId))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response('Could not subscribe please try again later', {
      status: 500
    })
  }
}

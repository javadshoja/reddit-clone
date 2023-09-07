/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { posts, subscriptions } from '@/db/schema'
import { PostValidator } from '@/lib/validators/post'
import { getCurrentUser } from '@/services/user'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { title, content, subredditId } = PostValidator.parse(body)

    const subscriptionExists = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.subredditId, subredditId),
        eq(subscriptions.userId, currentUser.id)
      )
    })

    if (!subscriptionExists) {
      return new Response('Subscribe to post.', {
        status: 400
      })
    }

    await db.insert(posts).values({
      title,
      content,
      authorId: currentUser.id,
      subredditId
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response(
      'Could not post to subreddit at this time, please try again later',
      {
        status: 500
      }
    )
  }
}

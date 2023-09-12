import { z } from 'zod'

import db from '@/db'
import { comments } from '@/db/schema'
import { CommentValidator } from '@/lib/validators/comment'
import { getCurrentUser } from '@/services/user'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { postId, text, replyToId } = CommentValidator.parse(body)

    await db
      .insert(comments)
      .values({ text, postId, authorId: currentUser.id, replyToId })

    return new Response('Comment created successfully.', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response('Could not create comment, please try again later', {
      status: 500
    })
  }
}

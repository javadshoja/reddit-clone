import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { commentVotes } from '@/db/schema'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { getCurrentUser } from '@/services/user'

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const authorId_commentId = and(
      eq(commentVotes.authorId, currentUser.id),
      eq(commentVotes.commentId, commentId)
    )

    const existingVote = await db.query.commentVotes.findFirst({
      where: authorId_commentId
    })

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.delete(commentVotes).where(authorId_commentId)

        return new Response('Vote deleted successfully.', { status: 200 })
      } else {
        // if vote type is different, update the vote
        await db
          .update(commentVotes)
          .set({ type: voteType })
          .where(authorId_commentId)

        return new Response('Vote updated successfully.', { status: 200 })
      }
    }

    // if no existing vote, create a new vote
    await db
      .insert(commentVotes)
      .values({ type: voteType, authorId: currentUser.id, commentId })

    return new Response('Vote created successfully.', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response(
      'Could not register your vote, please try again later',
      {
        status: 500
      }
    )
  }
}

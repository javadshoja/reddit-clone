import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import type { CachedPost } from '@/types/redis'
import db from '@/db'
import { posts, votes } from '@/db/schema'
import { redis } from '@/lib/redis'
import { PostVoteValidator } from '@/lib/validators/vote'
import { getCurrentUser } from '@/services/user'
import { CACHE_AFTER_UPVOTES } from '@/config'

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { postId, voteType } = PostVoteValidator.parse(body)

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        author: true,
        votes: true
      }
    })

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const authorId_postId = and(
      eq(votes.authorId, currentUser.id),
      eq(votes.postId, postId)
    )

    const existingVote = await db.query.votes.findFirst({
      where: authorId_postId
    })

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.delete(votes).where(authorId_postId)

        return new Response('Vote deleted successfully.', { status: 200 })
      }

      // if vote type is different, update the vote
      await db.update(votes).set({ type: voteType }).where(authorId_postId)

      // Recount the votes
      const voteAmount = post.votes.reduce((total, vote) => {
        if (vote.type === 'UP') return total + 1
        else if (vote.type === 'DOWN') return total - 1
        return total
      }, 0)

      if (voteAmount >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          id: post.id,
          title: post.title,
          authorUsername: post.author.username!,
          content: JSON.stringify(post.content),
          createdAt: post.createdAt!
        }

        await redis.hset(`post:${post.id}`, cachePayload)
        await redis.expire(`post:${post.id}`, 60 * 60 * 3)
      }

      return new Response('Vote updated successfully.', { status: 200 })
    }

    // if no existing vote, create a new vote
    await db
      .insert(votes)
      .values({ type: voteType, authorId: currentUser.id, postId })

    // Recount the votes
    const voteAmount = post.votes.reduce((total, vote) => {
      if (vote.type === 'UP') return total + 1
      else if (vote.type === 'DOWN') return total - 1
      return total
    }, 0)

    if (voteAmount >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        id: post.id,
        title: post.title,
        authorUsername: post.author.username!,
        content: JSON.stringify(post.content),
        createdAt: post.createdAt!
      }

      await redis.hset(`post:${post.id}`, cachePayload)
      await redis.expire(`post:${post.id}`, 60 * 60 * 3)
    }

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

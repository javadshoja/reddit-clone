import { desc, eq, inArray, type SQL } from 'drizzle-orm'
import { z } from 'zod'

import db from '@/db'
import { posts as Posts, subreddits, subscriptions } from '@/db/schema'
import { getCurrentUser } from '@/services/user'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const currentUser = await getCurrentUser()

  let followedCommunitiesIds: number[] = []

  if (currentUser) {
    const followedCommunities = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, currentUser.id),
      with: {
        subreddit: true
      }
    })

    followedCommunitiesIds = followedCommunities.map(
      ({ subreddit }) => subreddit.id
    )
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional()
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        subredditName: url.searchParams.get('subredditName')
      })

    let whereClause: SQL<unknown> | undefined = undefined

    if (subredditName) {
      const existingSubreddit = await db.query.subreddits.findFirst({
        where: eq(subreddits.name, subredditName)
      })

      if (existingSubreddit)
        whereClause = eq(Posts.subredditId, existingSubreddit.id)
    } else if (currentUser) {
      whereClause = inArray(Posts.subredditId, followedCommunitiesIds)
    }

    const posts = await db.query.posts.findMany({
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      orderBy: [desc(Posts.createdAt)],
      with: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true
      },
      where: whereClause
    })

    return new Response(JSON.stringify(posts), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed.', { status: 422 })
    }

    return new Response('Could not fetch more posts, please try again later', {
      status: 500
    })
  }
}

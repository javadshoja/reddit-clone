import React from 'react'

import { desc, eq, inArray } from 'drizzle-orm'

import db from '@/db'
import { posts as Posts, subscriptions } from '@/db/schema'
import { getCurrentUser } from '@/services/user'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'

import PostFeed from './PostFeed'

const CustomFeed = async () => {
  const currentUser = await getCurrentUser()

  const followedCommunities = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, currentUser!.id),
    with: {
      subreddit: true
    }
  })

  const followedCommunitiesIds = followedCommunities.map(
    ({ subreddit }) => subreddit.id
  )

  const posts = await db.query.posts.findMany({
    orderBy: [desc(Posts.createdAt)],
    where: inArray(Posts.subredditId, followedCommunitiesIds),
    with: {
      author: true,
      subreddit: true,
      votes: true,
      comments: true
    },
    limit: INFINITE_SCROLLING_PAGINATION_RESULTS
  })

  return <PostFeed initialPosts={posts} currentUser={currentUser} />
}

export default CustomFeed

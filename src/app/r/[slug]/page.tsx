import React from 'react'
import { notFound } from 'next/navigation'

import { desc, eq } from 'drizzle-orm'

import db from '@/db'
import { posts, subreddits } from '@/db/schema'
import { getCurrentUser } from '@/services/user'
import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'

type SubredditPageProps = {
  params: {
    slug: string
  }
}

const SubredditPage: React.FC<SubredditPageProps> = async ({ params }) => {
  const currentUser = await getCurrentUser()

  const { slug } = params

  const subreddit = await db.query.subreddits.findFirst({
    where: eq(subreddits.name, slug),
    with: {
      posts: {
        with: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        orderBy: [desc(posts.createdAt)]
      }
    }
  })

  if (!subreddit) return notFound()

  return (
    <>
      <h1 className='h-14 text-3xl font-bold md:text-4xl'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost currentUser={currentUser} />

      <PostFeed
        currentUser={currentUser}
        initialPosts={subreddit.posts}
        subredditName={subreddit.name}
      />
    </>
  )
}

export default SubredditPage

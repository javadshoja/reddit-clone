import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import type { CachedPost } from '@/types/redis'
import db from '@/db'
import { posts, type Post, type User, type Vote } from '@/db/schema'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import CommentSection from '@/components/comment/CommentSection'
import EditorOutput from '@/components/editor/EditorOutput'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { PostVoteShell } from '@/components/post-vote/PostVoteShell'

type pageProps = {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const PostPage: React.FC<pageProps> = async ({ params }) => {
  const postId = parseInt(params.postId)

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost

  const post:
    | (Post & {
        author: User
        votes: Vote[]
      })
    | undefined = cachedPost
    ? undefined
    : await db.query.posts.findFirst({
        where: eq(posts.id, postId),
        with: {
          author: true,
          votes: true
        }
      })

  if (!post && !cachedPost) return notFound()

  const getPostData = async () => {
    return await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        votes: true
      }
    })
  }

  return (
    <div className='flex h-full flex-col items-center justify-between sm:flex-row sm:items-start'>
      <Suspense fallback={<PostVoteShell />}>
        <PostVoteServer
          postId={post?.id ?? cachedPost.id}
          getData={getPostData}
        />
      </Suspense>

      <div className='w-full flex-1 rounded-sm bg-white p-4 sm:w-0'>
        <p className='mt-1 max-h-40 truncate text-xs text-gray-500'>
          Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
          {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
        </p>
        <h2 className='py-2 text-xl font-semibold leading-6 text-gray-900'>
          {post?.title ?? cachedPost.title}
        </h2>

        <EditorOutput content={post?.content ?? cachedPost.content} />

        <CommentSection postId={post?.id ?? cachedPost.id} />
      </div>
    </div>
  )
}

export default PostPage

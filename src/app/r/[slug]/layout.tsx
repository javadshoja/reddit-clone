import React from 'react'
import { notFound } from 'next/navigation'

import { format } from 'date-fns'
import { and, eq, sql } from 'drizzle-orm'

import db from '@/db'
import { subreddits, subscriptions } from '@/db/schema'
import { getCurrentUser } from '@/services/user'
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'

type SubredditLayoutProps = {
  children: React.ReactNode
  params: {
    slug: string
  }
}

const SubredditLayout: React.FC<SubredditLayoutProps> = async ({
  children,
  params
}) => {
  const currentUser = await getCurrentUser()

  const { slug } = params
  const subreddit = await db.query.subreddits.findFirst({
    where: eq(subreddits.name, slug),
    with: {
      posts: {
        with: {
          author: true,
          votes: true
        }
      }
    }
  })

  if (!subreddit) return notFound()

  const subscription = currentUser
    ? await db.query.subscriptions.findFirst({
        where: and(
          eq(subscriptions.subredditId, subreddit.id),
          eq(subscriptions.userId, currentUser.id)
        )
      })
    : undefined

  const isSubscribed = !!subscription

  const [memberCount] = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(subscriptions)
    .where(eq(subscriptions.subredditId, subreddit.id))

  return (
    <div className='mx-auto h-full max-w-7xl pt-12 sm:container'>
      {/* TODO: Button to take us back */}
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        <div className='col-span-2 flex flex-col space-y-6'>{children}</div>

        {/* Info sidebar */}
        <div className='order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last md:block'>
          <div className='px-6 py-4'>
            <p className='py-3 font-semibold'>About r/{subreddit?.name}</p>
          </div>

          <dl className='divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Created</dt>
              <dd className='text-gray-700'>
                <time dateTime={subreddit.createdAt?.toDateString()}>
                  {format(subreddit.createdAt!, 'MMMM d, yyyy')}
                </time>
              </dd>
            </div>

            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Members</dt>
              <dd className='text-gray-700'>
                <div className='text-gray-900'>{memberCount?.count ?? 0}</div>
              </dd>
            </div>

            {subreddit.creatorId === currentUser?.id ? (
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-gray-500'>You created this community</p>
              </div>
            ) : (
              <SubscribeLeaveToggle
                subredditId={subreddit.id}
                subredditName={subreddit.name}
                isSubscribed={isSubscribed}
              />
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default SubredditLayout

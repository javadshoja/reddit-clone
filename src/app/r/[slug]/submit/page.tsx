import React from 'react'
import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import db from '@/db'
import { subreddits } from '@/db/schema'
import { Button } from '@/components/ui/Button'
import Editor from '@/components/editor/Editor'

type SubmitPostPageProps = {
  params: {
    slug: string
  }
}

const SubmitPostPage: React.FC<SubmitPostPageProps> = async ({ params }) => {
  const { slug } = params

  const subreddit = await db.query.subreddits.findFirst({
    where: eq(subreddits.name, slug)
  })

  if (!subreddit) {
    return notFound()
  }

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className='border-b border-gray-200 pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in r/{slug}
          </p>
        </div>
      </div>

      {/* Form */}
      <Editor subredditId={subreddit.id} />
      <div className='flex w-full justify-end'>
        <Button type='submit' className='w-full' form='subreddit-form-post'>
          Post
        </Button>
      </div>
    </div>
  )
}
export default SubmitPostPage

'use client'

import { usePathname } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import { getSubredditPath } from '@/lib/utils'

import { buttonVariants } from './ui/Button'

const ToFeedButton = () => {
  const pathname = usePathname()

  // if path is /r/subreddit, turn into /
  // if path is /r/subreddit/post/[postId], turn into /r/subreddit

  const subredditPath = getSubredditPath(pathname)

  return (
    <a href={subredditPath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronLeft className='mr-1 h-4 w-4' />
      {subredditPath === '/' ? 'Back home' : 'Back to community'}
    </a>
  )
}

export default ToFeedButton

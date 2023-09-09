import React from 'react'

import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'

import { buttonVariants } from '@/components/ui/Button'

export const PostVoteShell = () => {
  return (
    <div className='flex w-20 flex-col items-center pr-6'>
      {/* Up vote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>
      {/* Score */}
      <div className='py-2 text-center text-sm font-medium text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* Down vote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'

import { usePrevious } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CommentVoteRequest } from '@/lib/validators/vote'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '@/hooks/useToast'
import type { VoteType } from '@/types'

import { Button } from './ui/Button'

type PostVoteClientProps = {
  commentId: number
  initialVoteAmount: number
  initialVote?: VoteType | null
}

const CommentVote: React.FC<PostVoteClientProps> = ({
  commentId,
  initialVoteAmount,
  initialVote
}) => {
  const { loginToast } = useCustomToast()

  const [voteAmount, setVoteAmount] = useState(initialVoteAmount)

  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type
      }

      const { data } = await axios.patch<string>(
        '/api/subreddit/post/comment/vote',
        payload
      )

      return data
    },
    onError(error, voteType) {
      if (voteType === 'UP') setVoteAmount((prev) => prev - 1)
      else if (voteType === 'DOWN') setVoteAmount((prev) => prev + 1)

      setCurrentVote(previousVote)

      if (error instanceof AxiosError && error.response?.status === 401) {
        return loginToast()
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive'
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)

        if (type === 'UP') setVoteAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVoteAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)

        if (type === 'UP') setVoteAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVoteAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className='flex gap-1'>
      <Button
        onClick={() => void vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote === 'UP'
          })}
        />
      </Button>

      <p className='py-2 text-center text-sm font-medium text-zinc-900 '>
        {voteAmount}
      </p>

      <Button
        onClick={() => void vote('DOWN')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-red-500 text-red-500': currentVote === 'DOWN'
          })}
        />
      </Button>
    </div>
  )
}

export default CommentVote

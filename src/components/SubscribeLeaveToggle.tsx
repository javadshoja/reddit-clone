'use client'

import React, { startTransition } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

import type { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '@/hooks/useToast'

import { Button } from './ui/Button'

type SubscribeLeaveToggleProps = {
  subredditId: number
  subredditName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed
}) => {
  const router = useRouter()

  const { loginToast } = useCustomToast()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post<string>(
        '/api/subreddit/subscribe',
        payload
      )

      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return loginToast()
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Subscribe',
        description: `You are now subscribed to r/${subredditName}`
      })
    }
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post<string>(
        '/api/subreddit/unsubscribe',
        payload
      )

      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return loginToast()
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Unsubscribe',
        description: `You are now unsubscribed from r/${subredditName}`
      })
    }
  })

  return isSubscribed ? (
    <Button
      onClick={() => void unsubscribe()}
      disabled={isUnsubLoading}
      className='mb-4 mt-1 w-full'
    >
      {isUnsubLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
      Leave community
    </Button>
  ) : (
    <Button
      onClick={() => void subscribe()}
      disabled={isSubLoading}
      className='mb-4 mt-1 w-full'
    >
      {isSubLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Join
      to post
    </Button>
  )
}

export default SubscribeLeaveToggle

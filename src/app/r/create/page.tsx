'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

import type { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const CreateSubredditPage = () => {
  const router = useRouter()
  const [input, setInput] = useState('')

  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input
      }

      const { data } = await axios.post<string>('/api/subreddit', payload)

      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401:
            return loginToast()
          case 409:
            return toast({
              title: 'Subreddit already exists.',
              description: 'Please choose a different subreddit name.',
              variant: 'destructive'
            })
          case 422:
            return toast({
              title: 'Invalid subreddit name.',
              description: 'Please choose a name between 3 and 21 characters.',
              variant: 'destructive'
            })

          default:
            return
        }
      }

      toast({
        title: 'There was an error.',
        description: 'Could not create subreddit.',
        variant: 'destructive'
      })
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
  })

  return (
    <div className='container mx-auto flex h-full max-w-3xl items-center'>
      <div className='h-fit w-full space-y-6 rounded-lg bg-white p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Create a community</h1>
        </div>

        <hr className='h-px bg-zinc-500' />

        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='pb-2 text-xs'>
            Community names including capitalization can not be changed.
          </p>

          <div className='relative'>
            <p className='absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400'>
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            />
          </div>
        </div>
        <div className='flex justify-end gap-4'>
          <Button variant='secondary' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            disabled={input.length === 0}
            onClick={() => void createCommunity()}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateSubredditPage

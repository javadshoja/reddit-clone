'use client'

import React, { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

import type { CommentRequest } from '@/lib/validators/comment'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '@/hooks/useToast'

import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'

type CreateCommentProps = {
  postId: number
  replyToId?: number
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const router = useRouter()

  const [input, setInput] = useState('')

  const { loginToast } = useCustomToast()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ text, postId, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        text,
        postId,
        replyToId
      }

      const { data } = await axios.post<string>(
        '/api/subreddit/post/comment',
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
        setInput('')
      })
    }
  })

  return (
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts?'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            disabled={input.length === 0}
            onClick={() => void comment({ text: input, postId, replyToId })}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment

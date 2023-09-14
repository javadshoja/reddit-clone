'use client'

import React, { startTransition, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2, MessageSquare } from 'lucide-react'

import type { CommentVote } from '@/db/schema'
import { formatTimeToNow } from '@/lib/utils'
import type { CommentRequest } from '@/lib/validators/comment'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '@/hooks/useToast'
import type { ExtendedComment, SafeUser } from '@/types'

import CommentVotes from '../CommentVote'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import UserAvatar from '../UserAvatar'

type PostCommentProps = {
  comment: ExtendedComment
  currentVote: CommentVote | undefined
  voteAmount: number
  postId: number
  currentUser: SafeUser | null | undefined
}

const PostComment: React.FC<PostCommentProps> = ({
  comment,
  currentVote,
  voteAmount,
  postId,
  currentUser
}) => {
  const router = useRouter()

  const [isReplying, setIsReplying] = useState(false)
  const [input, setInput] = useState('')

  const commentRef = useRef<HTMLDivElement>(null)

  const { loginToast } = useCustomToast()

  const { mutate: postComment, isLoading } = useMutation({
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
        title: 'Something went wrong',
        description: "Comment wasn't posted successfully, please try again",
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
        setIsReplying(false)
        setInput('')
      })
    }
  })

  return (
    <div ref={commentRef} className='flex flex-col'>
      <div className='flex items-center'>
        <UserAvatar currentUser={comment.author} className='h-6 w-6' />

        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-gray-900'>
            u/{comment.author.username}
          </p>
          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt!))}
          </p>
        </div>
      </div>

      <p className='mt-2 text-sm text-zinc-900'>{comment.text}</p>

      <div className='flex flex-wrap items-center gap-2'>
        <CommentVotes
          commentId={comment.id}
          initialVote={currentVote?.type}
          initialVoteAmount={voteAmount}
        />

        <Button
          onClick={() => {
            if (!currentUser) return router.push('/login')

            setIsReplying(true)
          }}
          variant='ghost'
          size='sm'
          aria-label='reply'
        >
          <MessageSquare className='mr-1.5 h-4 w-4' />
          Reply
        </Button>

        {isReplying && (
          <div className='grid w-full gap-1.5'>
            <Label htmlFor='replyComment'>Your comment</Label>
            <div className='mt-2'>
              <Textarea
                id='replyComment'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder='What are your thoughts?'
              />

              <div className='mt-2 flex justify-end gap-2'>
                <Button
                  tabIndex={-1}
                  variant='secondary'
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={input.length === 0}
                  onClick={() =>
                    void postComment({
                      text: input,
                      postId,
                      replyToId: comment.replyToId ?? comment.id
                    })
                  }
                >
                  {isLoading && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}{' '}
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostComment

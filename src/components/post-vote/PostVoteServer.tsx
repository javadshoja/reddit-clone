import React from 'react'
import { notFound } from 'next/navigation'

import type { Post, Vote } from '@/db/schema'
import { getCurrentUser } from '@/services/user'
import type { VoteType } from '@/types'

import PostVoteClient from './PostVoteClient'

type PostVoteServerProps = {
  postId: number
  initialVote?: VoteType | null
  initialVoteAmount?: number
  getData?: () => Promise<
    | (Post & {
        votes: Vote[]
      })
    | undefined
  >
}

const PostVoteServer: React.FC<PostVoteServerProps> = async ({
  postId,
  initialVote,
  initialVoteAmount,
  getData
}) => {
  const currentUser = await getCurrentUser()

  let _voteAmount = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()

    if (!post) return notFound()

    _voteAmount = post.votes.reduce((total, vote) => {
      if (vote.type === 'UP') return total + 1
      else if (vote.type === 'DOWN') return total - 1
      return total
    }, 0)

    _currentVote = post.votes.find((vote) => vote.authorId === currentUser?.id)
      ?.type
  } else {
    _voteAmount = initialVoteAmount ?? 0
    _currentVote = initialVote
  }
  return (
    <PostVoteClient
      postId={postId}
      initialVote={_currentVote}
      initialVoteAmount={_voteAmount}
    />
  )
}

export default PostVoteServer

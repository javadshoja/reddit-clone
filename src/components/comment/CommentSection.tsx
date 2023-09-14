import React from 'react'

import { and, eq, isNull } from 'drizzle-orm'

import db from '@/db'
import { comments as Comments } from '@/db/schema'
import { getCurrentUser } from '@/services/user'

import CreateComment from './CreateComment'
import PostComment from './PostComment'

type CommentSectionProps = {
  postId: number
}

const CommentSection: React.FC<CommentSectionProps> = async ({ postId }) => {
  const currentUser = await getCurrentUser()

  const comments = await db.query.comments.findMany({
    where: and(eq(Comments.postId, postId), isNull(Comments.replyToId)),
    with: {
      author: true,
      votes: true,
      replies: {
        with: {
          author: true,
          votes: true
        }
      }
    }
  })

  return (
    <div className='mt-4 flex flex-col gap-y-4'>
      <hr className='my-6 h-px w-full' />

      <CreateComment postId={postId} />

      <div className='mt-4 flex flex-col gap-y-6'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVoteAmount = topLevelComment.votes.reduce(
              (total, vote) => {
                if (vote.type === 'UP') return total + 1
                else if (vote.type === 'DOWN') return total - 1
                return total
              },
              0
            )

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.authorId === currentUser?.id
            )

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    voteAmount={topLevelCommentVoteAmount}
                    postId={postId}
                    currentUser={currentUser}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVoteAmount = reply.votes.reduce(
                      (total, vote) => {
                        if (vote.type === 'UP') return total + 1
                        else if (vote.type === 'DOWN') return total - 1
                        return total
                      },
                      0
                    )

                    const replyVote = reply.votes.find(
                      (vote) => vote.authorId === currentUser?.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 border-l-2 border-zinc-200 py-2 pl-4'
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          voteAmount={replyVoteAmount}
                          currentUser={currentUser}
                          postId={postId}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection

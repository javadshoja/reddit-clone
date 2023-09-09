import { z } from 'zod'

export const PostVoteValidator = z.object({
  postId: z.number(),
  voteType: z.enum(['UP', 'DOWN'])
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>

export const CommentVoteValidator = z.object({
  commentId: z.number(),
  voteType: z.enum(['UP', 'DOWN'])
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>

import { z } from 'zod'

export const CommentValidator = z.object({
  text: z.string(),
  postId: z.number(),
  replyToId: z.number().optional()
})

export type CommentRequest = z.infer<typeof CommentValidator>

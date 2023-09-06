import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be longer than 3 characters' })
    .max(128, { message: 'Title be at least 128 characters' }),
  subredditId: z.number(),
  content: z.any()
})

export type PostCreationRequest = z.infer<typeof PostValidator>

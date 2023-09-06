import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { getCurrentUser } from '@/services/user'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const currentUser = await getCurrentUser()

      if (!currentUser) throw new Error('Unauthorized')

      return { userId: currentUser.id }
    })
    .onUploadComplete(async () => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

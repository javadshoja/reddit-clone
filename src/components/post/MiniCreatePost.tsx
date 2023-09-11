'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { ImageIcon, Link2 } from 'lucide-react'

import type { SafeUser } from '@/types'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import UserAvatar from '../UserAvatar'

type MiniCreatePostProps = {
  currentUser: SafeUser | null | undefined
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ currentUser }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='overflow-hidden rounded-md bg-white shadow'>
      <div className='flex h-full justify-between gap-6 px-6 py-4'>
        <div className='relative'>
          <UserAvatar currentUser={currentUser} />

          <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white' />
        </div>
        <Input
          readOnly
          onClick={() => void router.push(`${pathname}/submit`)}
          placeholder='Create post'
        />

        <Button
          variant='ghost'
          onClick={() => void router.push(`${pathname}/submit`)}
        >
          <ImageIcon className='text-zinc-600' />
        </Button>

        <Button
          variant='ghost'
          onClick={() => void router.push(`${pathname}/submit`)}
        >
          <Link2 className='text-zinc-600' />
        </Button>
      </div>
    </div>
  )
}

export default MiniCreatePost

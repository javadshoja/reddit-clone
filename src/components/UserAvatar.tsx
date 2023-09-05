import React from 'react'
import Image from 'next/image'

import type { AvatarProps } from '@radix-ui/react-avatar'

import type { SafeUser } from '@/types'

import { Icons } from './Icons'
import { Avatar, AvatarFallback } from './ui/Avatar'

interface UserAvatarProps extends AvatarProps {
  currentUser: Omit<SafeUser, 'email'> | null | undefined
}

const UserAvatar: React.FC<UserAvatarProps> = ({ currentUser, ...props }) => {
  return (
    <Avatar {...props}>
      {currentUser?.image ? (
        <Image
          fill
          src={currentUser.image}
          alt='profile picture'
          referrerPolicy='no-referrer'
        />
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{currentUser?.name}</span>
          <Icons.user className='h-4 w-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar

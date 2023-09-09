'use client'

import React from 'react'
import Link from 'next/link'

import { signOut } from 'next-auth/react'

import type { SafeUser } from '@/types'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/DropdownMenu'
import UserAvatar from '../UserAvatar'

type UserAccountNavProps = {
  currentUser: SafeUser
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ currentUser }) => {
  const Logout = async (e: Event) => {
    e.preventDefault()

    await signOut({
      callbackUrl: `${window.location.origin}/login`
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className='h-10 w-10' currentUser={currentUser} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {currentUser.name && (
              <p className='font-medium'>{currentUser.name}</p>
            )}
            {currentUser.email && (
              <p className='w-[200px] truncate text-sm text-zinc-700'>
                {currentUser.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/'>Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/r/create'>Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='settings'>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => void Logout(e)}
          className='cursor-pointer'
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav

'use client'

import React, { useState } from 'react'

import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { useToast } from '@/hooks/useToast'

import { Icons } from './Icons'
import { Button } from './ui/Button'

enum PROVIDER {
  NULL = '',
  GOOGLE = 'google',
  GITHUB = 'github'
}

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<PROVIDER>(
    PROVIDER.NULL
  )
  const { toast } = useToast()

  const login = async (provider: PROVIDER) => {
    setIsLoading(true)
    setLoadingProvider(provider)

    try {
      await signIn(provider)
    } catch (error) {
      toast({
        title: 'There was a problem.',
        description: `There was an error logging with ${provider}`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setLoadingProvider(PROVIDER.NULL)
    }
  }

  return (
    <div className='flex flex-col justify-center gap-4'>
      <Button
        onClick={() => void login(PROVIDER.GOOGLE)}
        isLoading={isLoading}
        size='lg'
        className='w-full'
      >
        {loadingProvider === PROVIDER.GOOGLE ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.google className='mr-2 h-4 w-4' />
        )}{' '}
        Google
      </Button>
      <Button
        onClick={() => void login(PROVIDER.GITHUB)}
        isLoading={isLoading}
        size='lg'
        className='w-full'
      >
        {loadingProvider === PROVIDER.GITHUB ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.github className='mr-2 h-4 w-4' />
        )}{' '}
        Github
      </Button>
    </div>
  )
}

export default AuthForm

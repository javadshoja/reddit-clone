'use client'

import React, { useState } from 'react'

import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { useToast } from '@/hooks/useToast'

import { Icons } from './Icons'
import { Button } from './ui/Button'

enum PROVIDER {
  NULL,
  GOOGLE,
  GITHUB
}

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<PROVIDER>(0)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)
    setLoadingProvider(PROVIDER.GOOGLE)

    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'There was a problem.',
        description: 'There was an error logging with Google',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setLoadingProvider(PROVIDER.NULL)
    }
  }

  const loginWithGithub = async () => {
    setIsLoading(true)
    setLoadingProvider(PROVIDER.GITHUB)

    try {
      await signIn('github')
    } catch (error) {
      toast({
        title: 'There was a problem.',
        description: 'There was an error logging with Github',
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
        onClick={loginWithGoogle}
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
        onClick={loginWithGithub}
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

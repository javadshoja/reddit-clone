'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import type { User } from '@/db/schema'
import {
  UsernameValidator,
  type UsernameRequest
} from '@/lib/validators/username'
import { toast } from '@/hooks/useToast'

import { Button } from './ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/Card'
import { Input } from './ui/Input'
import { Label } from './ui/Label'

type UsernameFormProps = {
  currentUser: User
}

const UsernameForm: React.FC<UsernameFormProps> = ({ currentUser }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: currentUser.username || ''
    }
  })

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name
      }

      const { data } = await axios.patch<string>('api/username', payload)

      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        return toast({
          title: 'Username already taken',
          description: 'Please choose a different username',
          variant: 'destructive'
        })
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      toast({
        title: 'Successful',
        description: 'Your username has been updated.'
      })

      router.refresh()
    }
  })

  function onSubmit(data: UsernameRequest) {
    updateUser(data)
  }

  return (
    <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute left-0 top-0 grid h-10 w-8 place-items-center'>
              <span className='text-sm text-zinc-400'>u/</span>
            </div>

            <Label className='sr-only' htmlFor='name'>
              Name
            </Label>
            <Input
              id='name'
              className='w-[400px] pl-6'
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UsernameForm

import Link from 'next/link'

import { Icons } from '../Icons'
import AuthForm from './AuthForm'

const Login = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-12 w-12' />
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='mx-auto max-w-xs text-sm'>
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>
      </div>
      <AuthForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        New to Reddit?{' '}
        <Link
          href='/register'
          className='text-sm underline underline-offset-4 transition duration-300 hover:text-slate-700'
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login

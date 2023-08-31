import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'
import Login from '@/components/Login'

const LoginPage = () => {
  return (
    <div className='absolute inset-0'>
      <div className='mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20'>
        <Link
          href='/'
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            '-mt-20 self-start'
          )}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Home
        </Link>

        <Login />
      </div>
    </div>
  )
}

export default LoginPage

import { buttonVariants } from '@/components/ui/Button'
import Link from 'next/link'
import { toast } from './useToast'

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Login required.',
      description: 'You need to be logged in to do that.',
      variant: 'destructive',
      action: (
        <Link
          onClick={() => dismiss()}
          href='/login'
          className={buttonVariants({ variant: 'outline' })}>
          Login
        </Link>
      ),
    })
  }

  return { loginToast }
}

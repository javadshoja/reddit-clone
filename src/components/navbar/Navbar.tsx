import Link from 'next/link'

import { getCurrentUser } from '@/services/user'

import { Icons } from '../Icons'
import { buttonVariants } from '../ui/Button'
import SearchBar from './SearchBar'
import UserAccountNav from './UserAccountNav'

const Navbar = async () => {
  const currentUser = await getCurrentUser()

  return (
    <nav className='fixed inset-x-0 top-0 z-10 h-fit border-b border-zinc-300 bg-zinc-100 py-2'>
      <div className='container mx-auto flex h-full max-w-7xl items-center justify-between gap-2'>
        <Link href='/' className='flex items-center gap-2'>
          <Icons.logo className='h-9 w-9 sm:h-8 sm:w-8' />
          <Icons.reddit className='hidden h-[18px] sm:block' />
        </Link>

        <SearchBar />

        {currentUser ? (
          <UserAccountNav currentUser={currentUser} />
        ) : (
          <Link href='/login' className={buttonVariants()}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
export default Navbar

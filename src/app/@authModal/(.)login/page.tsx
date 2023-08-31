import React from 'react'

import CloseModal from '@/components/CloseModal'
import Login from '@/components/Login'

const LoginModalPage = () => {
  return (
    <div className='fixed inset-0 z-10 bg-zinc-900/20'>
      <div className='container mx-auto flex h-full max-w-lg items-center'>
        <div className='relative h-fit w-full rounded-lg bg-white px-2 py-20'>
          <div className='absolute right-4 top-4'>
            <CloseModal />
          </div>

          <Login />
        </div>
      </div>
    </div>
  )
}

export default LoginModalPage

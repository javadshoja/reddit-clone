import { cn } from '@/lib/utils'

import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Providers from '@/components/ui/Providers'
import { Toaster } from '@/components/ui/Toaster'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reddit',
  description: 'A Reddit clone whit Next.js and Typescript.'
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn('bg-white text-slate-900 antialiased', inter.className)}
    >
      <body className='min-h-screen bg-slate-50 pt-12 antialiased'>
        <Navbar />

        {authModal}

        <div className='container mx-auto h-full max-w-7xl pt-12'>
          <Providers>{children}</Providers>
        </div>

        <Toaster />
      </body>
    </html>
  )
}

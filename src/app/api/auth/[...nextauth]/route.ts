import type { NextApiRequest, NextApiResponse } from 'next'

import NextAuth from 'next-auth'

import authOptions from '@/lib/auth'

type Handler = () => Promise<NextApiRequest | NextApiResponse>

const handler = NextAuth(authOptions) as Handler

export { handler as GET, handler as POST }

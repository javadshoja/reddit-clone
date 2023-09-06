import NextAuth from 'next-auth'

import authOptions from '@/lib/auth'

type Handler = () => Promise<Response>

const handler = NextAuth(authOptions) as Handler

export { handler as GET, handler as POST }

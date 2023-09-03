import NextAuth from 'next-auth'

import authOptions from '@/lib/auth'

type Handler = () => Promise<Request | Response>

const handler = NextAuth(authOptions) as Handler

export { handler as GET, handler as POST }

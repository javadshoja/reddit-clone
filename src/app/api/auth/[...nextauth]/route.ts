import type { NextRequest, NextResponse } from 'next/server'

import NextAuth from 'next-auth'

import authOptions from '@/lib/auth'

type Handler = () => Promise<NextResponse | NextRequest>

const handler = NextAuth(authOptions) as Handler

export { handler as GET, handler as POST }

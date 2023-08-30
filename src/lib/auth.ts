import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import db from '@/db'
import { env } from '@/env.mjs'

const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    })
  ],
  callbacks: {
    redirect() {
      return '/'
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  debug: env.NODE_ENV === 'development',
  secret: env.NEXTAUTH_SECRET
}

export default authOptions

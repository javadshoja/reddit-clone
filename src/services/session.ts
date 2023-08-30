import { getServerSession } from 'next-auth'

import authOptions from '@/lib/auth'

export const getAuthSession = async () => await getServerSession(authOptions)

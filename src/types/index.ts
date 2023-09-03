import type { User } from '@/db/schema'

export type SafeUser = Pick<User, 'name' | 'email' | 'image'>

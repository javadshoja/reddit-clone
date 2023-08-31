import { InferSelectModel } from 'drizzle-orm'

import { users } from '@/db/schema'

export type User = InferSelectModel<typeof users>

export type SafeUser = Pick<User, 'name' | 'email' | 'image'>

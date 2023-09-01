import type { InferSelectModel } from 'drizzle-orm'

import type { user } from '@/db/schema'

export type User = InferSelectModel<typeof user>

export type SafeUser = Pick<User, 'name' | 'email' | 'image'>

import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const subscription = pgTable(
  'subscription',
  {
    userId: text('userId').notNull(),
    subredditId: text('userId').notNull()
  },
  (table) => ({
    id: primaryKey(table.userId, table.subredditId)
  })
)

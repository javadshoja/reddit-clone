import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const subscription = pgTable(
  'subscription',
  {
    userId: text('userId').notNull(),
    subredditId: text('subredditId').notNull()
  },
  (table) => ({
    compoundKey: primaryKey(table.userId, table.subredditId)
  })
)

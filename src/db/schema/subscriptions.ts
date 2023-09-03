import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const subscriptions = pgTable(
  'subscription',
  {
    userId: text('userId').notNull(),
    subredditId: integer('subredditId').notNull()
  },
  (subscription) => ({
    compoundKey: primaryKey(subscription.userId, subscription.subredditId)
  })
)

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

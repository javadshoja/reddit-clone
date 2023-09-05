import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { subreddits } from './subreddits'
import { users } from './users'

export const subscriptions = pgTable(
  'subscription',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id),
    subredditId: integer('subredditId')
      .notNull()
      .references(() => subreddits.id)
  },
  (subscription) => ({
    compoundKey: primaryKey(subscription.userId, subscription.subredditId)
  })
)

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  }),
  subreddit: one(subreddits, {
    fields: [subscriptions.subredditId],
    references: [subreddits.id]
  })
}))

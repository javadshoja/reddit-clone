import { relations } from 'drizzle-orm'
import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

import { posts } from './posts'
import { subscriptions } from './subscriptions'
import { users } from './users'

export const subreddits = pgTable(
  'subreddit',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt'),

    creatorId: text('creatorId').references(() => users.id)
  },
  (subreddit) => ({
    nameIdx: index('name_idx').on(subreddit.name)
  })
)

export type Subreddit = typeof subreddits.$inferSelect
export type NewSubreddit = typeof subreddits.$inferInsert

export const subredditsRelations = relations(subreddits, ({ one, many }) => ({
  creator: one(users, {
    fields: [subreddits.creatorId],
    references: [users.id],
    relationName: 'CreatedBy'
  }),

  posts: many(posts),

  subscribers: many(subscriptions)
}))

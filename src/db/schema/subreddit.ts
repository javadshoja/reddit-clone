import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { post } from './post'
import { user } from './user'
import { subscription } from './subscription'


export const subreddit = pgTable(
  'subreddit',
  {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').notNull(),

    creatorId: text('creatorId').references(() => user.id)
  },
  (table) => ({
    nameIdx: index('name_idx').on(table.name)
  })
)

export const subredditRelations = relations(subreddit, ({ one, many }) => ({
  creator: one(user, {
    fields: [subreddit.creatorId],
    references: [user.id],
    relationName: 'CreatedBy'
  }),

  posts: many(post),

  subscribers: many(subscription)
}))

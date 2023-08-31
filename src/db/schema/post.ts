import { relations } from 'drizzle-orm'
import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { comment } from './comment'
import { subreddit } from './subreddit'
import { user } from './user'
import { vote } from './vote'

export const post = pgTable('post', {
  id: text('id').notNull().primaryKey(),
  title: text('title').notNull(),
  content: json('content'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),

  subredditId: text('subredditId')
    .notNull()
    .references(() => subreddit.id, { onDelete: 'cascade' }),

  authorId: text('authorId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const postRelations = relations(post, ({ one, many }) => ({
  subreddit: one(subreddit, {
    fields: [post.subredditId],
    references: [subreddit.id]
  }),

  author: one(user, {
    fields: [post.authorId],
    references: [user.id]
  }),

  comments: many(comment),

  votes: many(vote)
}))

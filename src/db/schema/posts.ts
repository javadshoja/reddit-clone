import { relations } from 'drizzle-orm'
import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core'

import { comments } from './comments'
import { subreddits } from './subreddits'
import { users } from './users'
import { votes } from './votes'

export const posts = pgTable('post', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: json('content'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),

  subredditId: integer('subredditId')
    .notNull()
    .references(() => subreddits.id, { onDelete: 'cascade' }),

  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export const postsRelations = relations(posts, ({ one, many }) => ({
  subreddit: one(subreddits, {
    fields: [posts.subredditId],
    references: [subreddits.id]
  }),

  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),

  comments: many(comments),

  votes: many(votes)
}))

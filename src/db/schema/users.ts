import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { commentVotes } from './commentVotes'
import { posts } from './posts'
import { subreddits } from './subreddits'
import { votes } from './votes'

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  username: text('username').unique()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
  createdSubreddits: many(subreddits, {
    relationName: 'CreatedBy'
  }),

  posts: many(posts),

  votes: many(votes),

  commentVotes: many(commentVotes)
}))

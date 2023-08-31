import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { commentVote } from './commentVote'
import { post } from './post'
import { subreddit } from './subreddit'
import { vote } from './vote'

export const user = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  username: text('username').unique()
})

export const userRelations = relations(user, ({ many }) => ({
  createdSubreddits: many(subreddit, {
    relationName: 'CreatedBy'
  }),

  posts: many(post),

  votes: many(vote),

  commentVotes: many(commentVote)
}))

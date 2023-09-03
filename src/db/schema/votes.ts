import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { posts } from './posts'
import { users } from './users'

export const voteType = pgEnum('type', ['UP', 'DOWN'])

export const votes = pgTable(
  'vote',
  {
    type: voteType('type'),

    authorId: text('authorId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' })
  },
  (vote) => ({
    compoundKey: primaryKey(vote.authorId, vote.postId)
  })
)

export type Vote = typeof votes.$inferSelect
export type NewVote = typeof votes.$inferInsert

export const votesRelations = relations(votes, ({ one }) => ({
  author: one(users, {
    fields: [votes.authorId],
    references: [users.id]
  }),

  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id]
  })
}))

import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { post } from './post'
import { user } from './user'

export const voteType = pgEnum('type', ['UP', 'DOWN'])

export const vote = pgTable(
  'vote',
  {
    type: voteType('type'),

    authorId: text('authorId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    postId: text('postId')
      .notNull()
      .references(() => post.id, { onDelete: 'cascade' })
  },
  (table) => ({
    compoundKey: primaryKey(table.authorId, table.postId)
  })
)

export const voteRelations = relations(vote, ({ one }) => ({
  author: one(user, {
    fields: [vote.authorId],
    references: [user.id]
  }),

  post: one(post, {
    fields: [vote.postId],
    references: [post.id]
  })
}))

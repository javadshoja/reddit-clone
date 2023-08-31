import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { comment } from './comment'
import { user } from './user'
import { voteType } from './vote'

export const commentVote = pgTable(
  'commentVote',
  {
    type: voteType('type'),

    authorId: text('authorId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    commentId: text('commentId')
      .notNull()
      .references(() => comment.id, { onDelete: 'cascade' })
  },
  (table) => ({
    compoundKey: primaryKey(table.authorId, table.commentId)
  })
)

export const commentVoteRelations = relations(commentVote, ({ one }) => ({
  author: one(user, {
    fields: [commentVote.authorId],
    references: [user.id]
  }),

  comment: one(comment, {
    fields: [commentVote.commentId],
    references: [comment.id]
  })
}))

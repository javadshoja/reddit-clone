import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { comments } from './comments'
import { users } from './users'
import { voteType } from './votes'

export const commentVotes = pgTable(
  'commentVote',
  {
    type: voteType('type'),

    authorId: text('authorId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    commentId: integer('commentId')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' })
  },
  (commentVote) => ({
    compoundKey: primaryKey(commentVote.authorId, commentVote.commentId)
  })
)

export type CommentVote = typeof commentVotes.$inferSelect
export type NewCommentVote = typeof commentVotes.$inferInsert

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  author: one(users, {
    fields: [commentVotes.authorId],
    references: [users.id]
  }),

  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id]
  })
}))

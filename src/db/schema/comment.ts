import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { commentVote } from './commentVote'
import { post } from './post'
import { user } from './user'

export const comment = pgTable('comment', {
  id: text('id').notNull().primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  replyToId: text('replyToId'),
  commentId: text('commentId'),

  authorId: text('authorId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  postId: text('postId')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' })
})

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, {
    fields: [comment.authorId],
    references: [user.id]
  }),

  post: one(post, {
    fields: [comment.postId],
    references: [post.id]
  }),

  replyTo: one(comment, {
    fields: [comment.replyToId],
    references: [comment.id]
  }),

  replies: many(comment),

  votes: many(commentVote)
}))

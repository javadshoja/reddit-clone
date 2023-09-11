import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

import { commentVotes } from './commentVotes'
import { posts } from './posts'
import { users } from './users'

export const comments = pgTable('comment', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  replyToId: integer('replyToId'),

  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  postId: integer('postId')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' })
})

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  }),

  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),

  replyTo: one(comments, {
    fields: [comments.replyToId],
    references: [comments.id],
    relationName: 'replies'
  }),

  replies: many(comments, {
    relationName: 'replies'
  }),

  votes: many(commentVotes)
}))

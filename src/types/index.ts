import type { Comment, Post, Subreddit, User, Vote } from '@/db/schema'

export type SafeUser = Pick<User, 'name' | 'email' | 'image'>

export type ExtendedPost = Post & {
  author: User
  subreddit: Subreddit
  votes: Vote[]
  comments: Comment[]
}

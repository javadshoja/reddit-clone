import type { Comment, Post, Subreddit, User, Vote } from '@/db/schema'

export type SafeUser = Pick<User, 'name' | 'email' | 'image'>

export type ExtendedPost = Post & {
  author: User
  subreddit: Subreddit
  votes: Vote[]
  comments: Comment[]
}

export type VoteType = 'UP' | 'DOWN'

export type PartialVote = Pick<Vote, 'type'>

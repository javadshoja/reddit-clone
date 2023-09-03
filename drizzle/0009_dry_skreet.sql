ALTER TABLE "account" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "comment" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "commentVote" RENAME TO "commentVotes";--> statement-breakpoint
ALTER TABLE "post" RENAME TO "posts";--> statement-breakpoint
ALTER TABLE "subreddit" RENAME TO "subreddits";--> statement-breakpoint
ALTER TABLE "subscription" RENAME TO "subscriptions";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "vote" RENAME TO "votes";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_authorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_postId_post_id_fk";
--> statement-breakpoint
ALTER TABLE "commentVotes" DROP CONSTRAINT "commentVote_authorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "commentVotes" DROP CONSTRAINT "commentVote_commentId_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "post_subredditId_subreddit_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "post_authorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "subreddits" DROP CONSTRAINT "subreddit_creatorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "vote_authorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "vote_postId_post_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_subredditId_subreddits_id_fk" FOREIGN KEY ("subredditId") REFERENCES "subreddits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subreddits" ADD CONSTRAINT "subreddits_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
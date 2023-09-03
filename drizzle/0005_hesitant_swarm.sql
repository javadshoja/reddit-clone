ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "postId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "commentVote" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "commentVote" ALTER COLUMN "commentId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "subredditId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subreddit" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "subreddit" ALTER COLUMN "creatorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "subredditId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "postId" SET DATA TYPE integer;
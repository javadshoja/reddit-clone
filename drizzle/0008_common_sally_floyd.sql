ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "authorId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "commentVote" ALTER COLUMN "authorId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "authorId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subreddit" ALTER COLUMN "creatorId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "authorId" SET DATA TYPE text;
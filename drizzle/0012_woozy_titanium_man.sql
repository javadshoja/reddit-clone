ALTER TABLE "comment" ALTER COLUMN "replyToId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN IF EXISTS "commentId";
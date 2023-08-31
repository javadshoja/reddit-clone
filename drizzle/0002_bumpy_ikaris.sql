ALTER TABLE "vote" RENAME COLUMN "userId" TO "authorId";--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_userId_postId";--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vote" ADD CONSTRAINT "vote_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_authorId_postId" PRIMARY KEY("authorId","postId");
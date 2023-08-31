ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_userId";--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "subredditId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_subredditId" PRIMARY KEY("userId","subredditId");
-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "problems" (
	"id" varchar(50) NOT NULL,
	"nums" integer[],
	"solution" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"gameid" uuid NOT NULL,
	"userid" uuid,
	"problem_ids" varchar(50)[],
	"problem_index" integer,
	"problem_start_times" timestamp[],
	"problem_end_times" timestamp[],
	"problem_times" integer[],
	"problem_scores" integer[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leaderboard" (
	"gameid" uuid,
	"score" integer,
	"userid" uuid NOT NULL,
	"yearmonth" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/
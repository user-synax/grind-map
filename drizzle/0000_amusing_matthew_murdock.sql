CREATE TABLE "roadmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"isDefault" boolean DEFAULT false,
	"createdBy" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "streaks" (
	"userId" text PRIMARY KEY NOT NULL,
	"currentStreak" integer DEFAULT 0,
	"longestStreak" integer DEFAULT 0,
	"lastActiveDate" date
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roadmapId" uuid,
	"title" text NOT NULL,
	"description" text,
	"orderIndex" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "userProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text,
	"topicId" uuid,
	"status" text DEFAULT 'not_started' NOT NULL,
	"lastReviewedAt" timestamp,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"clerkId" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_createdBy_users_clerkId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("clerkId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_userId_users_clerkId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("clerkId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_roadmapId_roadmaps_id_fk" FOREIGN KEY ("roadmapId") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_userId_users_clerkId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("clerkId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_topicId_topics_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
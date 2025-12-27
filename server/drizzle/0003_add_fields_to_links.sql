ALTER TABLE "links" ADD COLUMN "platform" varchar(50) DEFAULT 'custom' NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "updated_at" timestamp DEFAULT now();
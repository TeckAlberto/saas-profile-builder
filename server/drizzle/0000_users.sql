CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"password_hash" varchar(60) NOT NULL,
	"plan" varchar(10) DEFAULT 'free' NOT NULL,
	"customer_id" varchar(255),
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_key" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_customer_id_key" ON "users" USING btree ("customer_id");

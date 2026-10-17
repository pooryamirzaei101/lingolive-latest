CREATE TABLE `content_access` (
	`id` text PRIMARY KEY NOT NULL,
	`free` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`user_id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`subscription_id` text,
	`customer_id` text
);
--> statement-breakpoint
CREATE TABLE `payment_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`plan` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`provider_ref` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`paid_at` integer,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_payment_orders_provider_ref` ON `payment_orders` (`provider_ref`);--> statement-breakpoint
CREATE INDEX `idx_payment_orders_user` ON `payment_orders` (`user_id`);--> statement-breakpoint
CREATE TABLE `payment_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`iran_monthly` integer DEFAULT 400000 NOT NULL,
	`iran_annual` integer DEFAULT 2400000 NOT NULL,
	`international_monthly` integer DEFAULT 0 NOT NULL,
	`international_annual` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'eur' NOT NULL,
	`iran_enabled` integer DEFAULT 0 NOT NULL,
	`international_enabled` integer DEFAULT 0 NOT NULL,
	`merchant_key` text DEFAULT '' NOT NULL,
	`stripe_key` text DEFAULT '' NOT NULL,
	`webhook_key` text DEFAULT '' NOT NULL
);

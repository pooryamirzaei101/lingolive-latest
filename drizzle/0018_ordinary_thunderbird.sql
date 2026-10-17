CREATE TABLE `premium_grants` (
	`user_id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`granted_by` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_admin_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`target_id` text NOT NULL,
	`action` text NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_user_admin_audit_target` ON `user_admin_audit` (`target_id`);--> statement-breakpoint
ALTER TABLE `learner_profiles` ADD `is_pending` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `learner_profiles` ADD `pending_email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learner_profiles_pending_email` ON `learner_profiles` (`pending_email`);
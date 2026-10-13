CREATE TABLE `referral_codes` (
	`user_id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referral_codes_code_unique` ON `referral_codes` (`code`);--> statement-breakpoint
CREATE TABLE `referral_entitlements` (
	`user_id` text PRIMARY KEY NOT NULL,
	`milestones_granted` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `referral_signups` (
	`invitee_user_id` text PRIMARY KEY NOT NULL,
	`inviter_user_id` text NOT NULL,
	`invitee_email` text NOT NULL,
	`created_at` integer NOT NULL,
	`confirmed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referral_signups_invitee_email_unique` ON `referral_signups` (`invitee_email`);--> statement-breakpoint
CREATE INDEX `idx_referral_signups_inviter` ON `referral_signups` (`inviter_user_id`,`confirmed_at`);
CREATE TABLE `learner_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`level` text DEFAULT '' NOT NULL,
	`purpose` text DEFAULT '' NOT NULL,
	`newsletter_consent` integer DEFAULT 0 NOT NULL,
	`newsletter_consent_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_learner_profiles_created` ON `learner_profiles` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_learner_profiles_country` ON `learner_profiles` (`country`);
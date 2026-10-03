CREATE TABLE `media_integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`assembly_key` text DEFAULT '' NOT NULL,
	`google_key` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transcript_jobs` (
	`lesson_id` text PRIMARY KEY NOT NULL,
	`provider_id` text DEFAULT '' NOT NULL,
	`state` text NOT NULL,
	`languages` text DEFAULT '[]' NOT NULL,
	`segments` text DEFAULT '[]' NOT NULL,
	`cursor` integer DEFAULT 0 NOT NULL,
	`error` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);

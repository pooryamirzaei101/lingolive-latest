CREATE TABLE `media_transcripts` (
	`id` text PRIMARY KEY NOT NULL,
	`segments` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `translation_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`english` text NOT NULL,
	`language` text NOT NULL,
	`translation` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'provider' NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `translation_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`characters` integer DEFAULT 0 NOT NULL
);

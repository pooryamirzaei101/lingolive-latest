CREATE TABLE `ielts_speaking_examples` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`question` text NOT NULL,
	`cue` text DEFAULT '' NOT NULL,
	`answer` text NOT NULL,
	`translation` text DEFAULT '' NOT NULL,
	`audio_key` text,
	`mime_type` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ielts_speaking_category_status` ON `ielts_speaking_examples` (`category`,`status`);
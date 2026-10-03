CREATE TABLE `quick_tip_lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`translation` text DEFAULT '' NOT NULL,
	`example` text DEFAULT '' NOT NULL,
	`example_translation` text DEFAULT '' NOT NULL,
	`audio_key` text,
	`mime_type` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_quick_tips_category_status` ON `quick_tip_lessons` (`category`,`status`);
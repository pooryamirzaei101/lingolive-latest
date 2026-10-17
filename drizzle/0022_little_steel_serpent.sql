CREATE TABLE `reading_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`chapter_id` text NOT NULL,
	`position` integer NOT NULL,
	`kind` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`media_key` text,
	`mime_type` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reading_blocks_chapter_position` ON `reading_blocks` (`chapter_id`,`position`);
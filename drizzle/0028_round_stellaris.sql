CREATE TABLE `ielts_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`position` integer NOT NULL,
	`kind` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`media_key` text,
	`mime_type` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ielts_blocks_lesson_position` ON `ielts_blocks` (`lesson_id`,`position`);
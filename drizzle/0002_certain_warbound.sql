CREATE TABLE `speaking_recordings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`media_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_speaking_recordings_user_lesson` ON `speaking_recordings` (`user_id`,`lesson_id`);--> statement-breakpoint
ALTER TABLE `video_categories` ADD `section` text DEFAULT 'video' NOT NULL;--> statement-breakpoint
ALTER TABLE `video_categories` ADD `parent_id` text;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `content_kind` text DEFAULT 'video' NOT NULL;
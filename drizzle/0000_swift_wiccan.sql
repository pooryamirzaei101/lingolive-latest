CREATE TABLE `learner_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`translation_language` text DEFAULT 'fa' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `saved_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`word` text NOT NULL,
	`translation` text DEFAULT '' NOT NULL,
	`source_lesson_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_saved_vocabulary_user_word` ON `saved_vocabulary` (`user_id`,`word`);--> statement-breakpoint
CREATE TABLE `video_lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`level` text DEFAULT 'Beginner' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`media_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`transcript` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_video_lessons_status_category` ON `video_lessons` (`status`,`category`);
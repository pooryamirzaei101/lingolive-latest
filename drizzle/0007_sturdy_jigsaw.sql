CREATE TABLE `routine_lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`phrase` text NOT NULL,
	`phrase_translation` text DEFAULT '' NOT NULL,
	`explanation` text NOT NULL,
	`example_one` text NOT NULL,
	`example_one_translation` text DEFAULT '' NOT NULL,
	`example_two` text NOT NULL,
	`example_two_translation` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`audio_key` text,
	`mime_type` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_routine_lessons_status_created` ON `routine_lessons` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `saved_routines` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_saved_routines_user_lesson` ON `saved_routines` (`user_id`,`lesson_id`);
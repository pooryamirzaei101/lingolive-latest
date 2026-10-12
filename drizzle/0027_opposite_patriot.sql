CREATE TABLE `ielts_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`completed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_ielts_progress_user_lesson` ON `ielts_progress` (`user_id`,`lesson_id`);
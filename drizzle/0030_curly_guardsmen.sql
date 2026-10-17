CREATE TABLE `learning_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`section` text NOT NULL,
	`lesson_id` text NOT NULL,
	`day` text NOT NULL,
	`active_seconds` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learning_daily_user_lesson_day` ON `learning_daily` (`user_id`,`section`,`lesson_id`,`day`);--> statement-breakpoint
CREATE INDEX `idx_learning_daily_user_day` ON `learning_daily` (`user_id`,`day`);--> statement-breakpoint
CREATE TABLE `learning_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`section` text NOT NULL,
	`lesson_id` text NOT NULL,
	`title` text NOT NULL,
	`href` text NOT NULL,
	`first_accessed_at` integer NOT NULL,
	`last_accessed_at` integer NOT NULL,
	`completed_at` integer,
	`active_seconds` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learning_progress_user_lesson` ON `learning_progress` (`user_id`,`section`,`lesson_id`);--> statement-breakpoint
CREATE INDEX `idx_learning_progress_user_recent` ON `learning_progress` (`user_id`,`last_accessed_at`);
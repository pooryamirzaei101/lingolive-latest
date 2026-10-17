CREATE TABLE `saved_sentences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`lesson_title` text NOT NULL,
	`section` text NOT NULL,
	`start_ms` integer NOT NULL,
	`english` text NOT NULL,
	`translation` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_saved_sentences_user_lesson_start` ON `saved_sentences` (`user_id`,`lesson_id`,`start_ms`);--> statement-breakpoint
CREATE INDEX `idx_saved_sentences_user_created` ON `saved_sentences` (`user_id`,`created_at`);
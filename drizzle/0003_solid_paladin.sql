CREATE TABLE `reading_chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`position` integer NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reading_chapters_item_position` ON `reading_chapters` (`item_id`,`position`);--> statement-breakpoint
CREATE TABLE `reading_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`level` text DEFAULT 'Beginner' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reading_items_status_category` ON `reading_items` (`status`,`category`);
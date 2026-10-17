CREATE TABLE `support_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`author_id` text NOT NULL,
	`is_admin` integer DEFAULT 0 NOT NULL,
	`body` text NOT NULL,
	`attachment_key` text DEFAULT '' NOT NULL,
	`attachment_type` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_support_messages_ticket` ON `support_messages` (`ticket_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_support_messages_author` ON `support_messages` (`author_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`category` text NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`lesson_path` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_support_user_updated` ON `support_tickets` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_support_status_updated` ON `support_tickets` (`status`,`updated_at`);
ALTER TABLE `reading_items` ADD `document_key` text;--> statement-breakpoint
ALTER TABLE `reading_items` ADD `document_mime_type` text;--> statement-breakpoint
ALTER TABLE `routine_lessons` ADD `category` text DEFAULT 'daily-everyday' NOT NULL;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `display_format` text DEFAULT 'landscape' NOT NULL;
ALTER TABLE `video_lessons` ADD `thumbnail_key` text;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `thumbnail_source` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `thumbnail_settings` text DEFAULT '{"fit":"contain","x":50,"y":50,"zoom":1}' NOT NULL;
ALTER TABLE `ielts_speaking_examples` ADD `kind` text DEFAULT 'listening' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `track` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `questions` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `vocabulary` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `video_key` text;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `video_mime_type` text;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `video_url` text;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `scroll_speed` integer DEFAULT 32 NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `cue_points` text DEFAULT '[]' NOT NULL;
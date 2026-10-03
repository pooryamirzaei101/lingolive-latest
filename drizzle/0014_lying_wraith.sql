ALTER TABLE `media_integrations` ADD `youtube_client_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `media_integrations` ADD `youtube_client_secret` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `media_integrations` ADD `youtube_refresh_token` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `video_lessons` ADD `transcription_key` text;
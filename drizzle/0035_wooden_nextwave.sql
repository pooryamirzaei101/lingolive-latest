ALTER TABLE `media_integrations` ADD `transcription_provider` text DEFAULT 'assembly' NOT NULL;--> statement-breakpoint
ALTER TABLE `media_integrations` ADD `custom_transcription` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `media_integrations` ADD `custom_translation` text DEFAULT '' NOT NULL;

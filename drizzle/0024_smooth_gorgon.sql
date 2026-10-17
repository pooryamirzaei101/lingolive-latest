ALTER TABLE `ielts_speaking_examples` ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `level` text DEFAULT 'Intermediate' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `band` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `format` text DEFAULT 'audio' NOT NULL;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `thumbnail_key` text;--> statement-breakpoint
ALTER TABLE `ielts_speaking_examples` ADD `pdf_key` text;
ALTER TABLE `payment_settings` ADD `iran_manual_enabled` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `iran_card_holder` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `iran_card_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `iran_card_image` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `iran_instructions` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_enabled` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_monthly` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_annual` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_currency` text DEFAULT 'USDT' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_network` text DEFAULT 'TRC20' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_wallet` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `crypto_instructions` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_manual_enabled` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_card_holder` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_card_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_card_image` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_instructions` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE TABLE `referral_settings` (`id` text PRIMARY KEY NOT NULL,`share_text` text DEFAULT 'Learn English with me on LingoLive!' NOT NULL,`link_template` text DEFAULT '/invite/{code}' NOT NULL,`updated_at` integer DEFAULT 0 NOT NULL);

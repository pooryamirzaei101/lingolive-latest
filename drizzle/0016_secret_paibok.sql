PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payment_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`pricing_revision` integer DEFAULT 0 NOT NULL,
	`iran_monthly` integer DEFAULT 400000 NOT NULL,
	`iran_annual` integer DEFAULT 1000000 NOT NULL,
	`international_monthly` integer DEFAULT 0 NOT NULL,
	`international_annual` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'eur' NOT NULL,
	`iran_enabled` integer DEFAULT 0 NOT NULL,
	`international_enabled` integer DEFAULT 0 NOT NULL,
	`merchant_key` text DEFAULT '' NOT NULL,
	`stripe_key` text DEFAULT '' NOT NULL,
	`webhook_key` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_payment_settings`("id", "pricing_revision", "iran_monthly", "iran_annual", "international_monthly", "international_annual", "currency", "iran_enabled", "international_enabled", "merchant_key", "stripe_key", "webhook_key") SELECT "id", 0, "iran_monthly", "iran_annual", "international_monthly", "international_annual", "currency", "iran_enabled", "international_enabled", "merchant_key", "stripe_key", "webhook_key" FROM `payment_settings`;--> statement-breakpoint
DROP TABLE `payment_settings`;--> statement-breakpoint
ALTER TABLE `__new_payment_settings` RENAME TO `payment_settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
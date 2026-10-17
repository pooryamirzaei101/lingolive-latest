ALTER TABLE `payment_settings` ADD `international_bank_one_name` text DEFAULT 'Ziraat Bankası' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_bank_one_iban` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_bank_two_name` text DEFAULT 'VakıfBank' NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_settings` ADD `international_bank_two_iban` text DEFAULT '' NOT NULL;

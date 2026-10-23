CREATE TABLE "content_access" (
	"id" text PRIMARY KEY NOT NULL,
	"free" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hidden_samples" (
	"id" text PRIMARY KEY NOT NULL,
	"hidden_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ielts_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"position" bigint NOT NULL,
	"kind" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"media_key" text,
	"mime_type" text,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ielts_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"completed_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ielts_speaking_examples" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"question" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"level" text DEFAULT 'Intermediate' NOT NULL,
	"band" text DEFAULT '' NOT NULL,
	"format" text DEFAULT 'audio' NOT NULL,
	"thumbnail_key" text,
	"pdf_key" text,
	"cue" text DEFAULT '' NOT NULL,
	"answer" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"audio_key" text,
	"mime_type" text,
	"kind" text DEFAULT 'listening' NOT NULL,
	"track" text DEFAULT '' NOT NULL,
	"questions" text DEFAULT '[]' NOT NULL,
	"vocabulary" text DEFAULT '' NOT NULL,
	"video_key" text,
	"video_mime_type" text,
	"display_format" text DEFAULT 'landscape' NOT NULL,
	"video_url" text,
	"scroll_speed" bigint DEFAULT 32 NOT NULL,
	"cue_points" text DEFAULT '[]' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learner_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"translation_language" text DEFAULT 'fa' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learner_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"is_pending" bigint DEFAULT 0 NOT NULL,
	"pending_email" text,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"level" text DEFAULT '' NOT NULL,
	"purpose" text DEFAULT '' NOT NULL,
	"newsletter_consent" bigint DEFAULT 0 NOT NULL,
	"newsletter_consent_at" bigint,
	"completed_at" bigint,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL,
	"last_seen_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_daily" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"section" text NOT NULL,
	"lesson_id" text NOT NULL,
	"day" text NOT NULL,
	"active_seconds" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"section" text NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"href" text NOT NULL,
	"first_accessed_at" bigint NOT NULL,
	"last_accessed_at" bigint NOT NULL,
	"completed_at" bigint,
	"active_seconds" bigint DEFAULT 0 NOT NULL,
	"resume_seconds" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"assembly_key" text DEFAULT '' NOT NULL,
	"google_key" text DEFAULT '' NOT NULL,
	"translation_provider" text DEFAULT 'google' NOT NULL,
	"deepl_key" text DEFAULT '' NOT NULL,
	"deepl_plan" text DEFAULT 'free' NOT NULL,
	"azure_key" text DEFAULT '' NOT NULL,
	"azure_region" text DEFAULT '' NOT NULL,
	"youtube_client_id" text DEFAULT '' NOT NULL,
	"youtube_client_secret" text DEFAULT '' NOT NULL,
	"youtube_refresh_token" text DEFAULT '' NOT NULL,
	"enabled" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_transcripts" (
	"id" text PRIMARY KEY NOT NULL,
	"segments" text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"user_id" text PRIMARY KEY NOT NULL,
	"expires_at" bigint NOT NULL,
	"subscription_id" text,
	"customer_id" text
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"plan" text NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text NOT NULL,
	"provider_ref" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" bigint NOT NULL,
	"paid_at" bigint,
	"expires_at" bigint
);
--> statement-breakpoint
CREATE TABLE "payment_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"pricing_revision" bigint DEFAULT 0 NOT NULL,
	"iran_monthly" bigint DEFAULT 400000 NOT NULL,
	"iran_annual" bigint DEFAULT 1000000 NOT NULL,
	"international_monthly" bigint DEFAULT 0 NOT NULL,
	"international_annual" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'eur' NOT NULL,
	"iran_enabled" bigint DEFAULT 0 NOT NULL,
	"international_enabled" bigint DEFAULT 0 NOT NULL,
	"merchant_key" text DEFAULT '' NOT NULL,
	"stripe_key" text DEFAULT '' NOT NULL,
	"webhook_key" text DEFAULT '' NOT NULL,
	"iran_manual_enabled" bigint DEFAULT 0 NOT NULL,
	"iran_card_holder" text DEFAULT '' NOT NULL,
	"iran_card_number" text DEFAULT '' NOT NULL,
	"iran_card_image" text DEFAULT '' NOT NULL,
	"iran_instructions" text DEFAULT '' NOT NULL,
	"crypto_enabled" bigint DEFAULT 0 NOT NULL,
	"crypto_monthly" bigint DEFAULT 0 NOT NULL,
	"crypto_annual" bigint DEFAULT 0 NOT NULL,
	"crypto_currency" text DEFAULT 'USDT' NOT NULL,
	"crypto_network" text DEFAULT 'TRC20' NOT NULL,
	"crypto_wallet" text DEFAULT '' NOT NULL,
	"crypto_instructions" text DEFAULT '' NOT NULL,
	"international_manual_enabled" bigint DEFAULT 0 NOT NULL,
	"international_card_holder" text DEFAULT '' NOT NULL,
	"international_card_number" text DEFAULT '' NOT NULL,
	"international_card_image" text DEFAULT '' NOT NULL,
	"international_instructions" text DEFAULT '' NOT NULL,
	"international_bank_one_name" text DEFAULT 'Ziraat Bankası' NOT NULL,
	"international_bank_one_iban" text DEFAULT '' NOT NULL,
	"international_bank_two_name" text DEFAULT 'VakıfBank' NOT NULL,
	"international_bank_two_iban" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "premium_grants" (
	"user_id" text PRIMARY KEY NOT NULL,
	"expires_at" bigint NOT NULL,
	"granted_by" text NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_tip_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"example" text DEFAULT '' NOT NULL,
	"example_translation" text DEFAULT '' NOT NULL,
	"audio_key" text,
	"mime_type" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter_id" text NOT NULL,
	"position" bigint NOT NULL,
	"kind" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"media_key" text,
	"mime_type" text,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"position" bigint NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"level" text DEFAULT 'Beginner' NOT NULL,
	"document_key" text,
	"document_mime_type" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"user_id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referral_entitlements" (
	"user_id" text PRIMARY KEY NOT NULL,
	"milestones_granted" bigint DEFAULT 0 NOT NULL,
	"expires_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"share_text" text DEFAULT 'Learn English with me on LingoLive!' NOT NULL,
	"link_template" text DEFAULT '/invite/{code}' NOT NULL,
	"updated_at" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_signups" (
	"invitee_user_id" text PRIMARY KEY NOT NULL,
	"inviter_user_id" text NOT NULL,
	"invitee_email" text NOT NULL,
	"created_at" bigint NOT NULL,
	"confirmed_at" bigint,
	CONSTRAINT "referral_signups_invitee_email_unique" UNIQUE("invitee_email")
);
--> statement-breakpoint
CREATE TABLE "routine_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT 'daily-everyday' NOT NULL,
	"phrase" text NOT NULL,
	"phrase_translation" text DEFAULT '' NOT NULL,
	"explanation" text NOT NULL,
	"example_one" text NOT NULL,
	"example_one_translation" text DEFAULT '' NOT NULL,
	"example_two" text NOT NULL,
	"example_two_translation" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"audio_key" text,
	"mime_type" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_routines" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_sentences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"lesson_title" text NOT NULL,
	"section" text NOT NULL,
	"start_ms" bigint NOT NULL,
	"english" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_vocabulary" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"translation_language" text DEFAULT 'fa' NOT NULL,
	"source_lesson_id" text NOT NULL,
	"example_sentence" text DEFAULT '' NOT NULL,
	"lesson_title" text DEFAULT '' NOT NULL,
	"source_section" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaking_recordings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"duration" bigint DEFAULT 0 NOT NULL,
	"media_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"author_id" text NOT NULL,
	"is_admin" bigint DEFAULT 0 NOT NULL,
	"body" text NOT NULL,
	"attachment_key" text DEFAULT '' NOT NULL,
	"attachment_type" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"category" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"lesson_path" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcript_jobs" (
	"lesson_id" text PRIMARY KEY NOT NULL,
	"provider_id" text DEFAULT '' NOT NULL,
	"state" text NOT NULL,
	"languages" text DEFAULT '[]' NOT NULL,
	"segments" text DEFAULT '[]' NOT NULL,
	"cursor" bigint DEFAULT 0 NOT NULL,
	"error" text DEFAULT '' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"english" text NOT NULL,
	"language" text NOT NULL,
	"translation" text DEFAULT '' NOT NULL,
	"source" text DEFAULT 'provider' NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0 NOT NULL,
	"characters" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_admin_audit" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"target_id" text NOT NULL,
	"action" text NOT NULL,
	"expires_at" bigint,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"section" text DEFAULT 'video' NOT NULL,
	"parent_id" text,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"content_kind" text DEFAULT 'video' NOT NULL,
	"level" text DEFAULT 'Beginner' NOT NULL,
	"tags" text DEFAULT '' NOT NULL,
	"media_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"source_url" text,
	"transcription_key" text,
	"display_format" text DEFAULT 'landscape' NOT NULL,
	"thumbnail_key" text,
	"thumbnail_source" text DEFAULT 'default' NOT NULL,
	"thumbnail_settings" text DEFAULT '{"fit":"contain","x":50,"y":50,"zoom":1}' NOT NULL,
	"transcript" text DEFAULT '[]' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_ielts_blocks_lesson_position" ON "ielts_blocks" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_ielts_progress_user_lesson" ON "ielts_progress" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "idx_ielts_speaking_category_status" ON "ielts_speaking_examples" USING btree ("category","status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_learner_profiles_pending_email" ON "learner_profiles" USING btree ("pending_email");--> statement-breakpoint
CREATE INDEX "idx_learner_profiles_created" ON "learner_profiles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_learner_profiles_country" ON "learner_profiles" USING btree ("country");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_learning_daily_user_lesson_day" ON "learning_daily" USING btree ("user_id","section","lesson_id","day");--> statement-breakpoint
CREATE INDEX "idx_learning_daily_user_day" ON "learning_daily" USING btree ("user_id","day");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_learning_progress_user_lesson" ON "learning_progress" USING btree ("user_id","section","lesson_id");--> statement-breakpoint
CREATE INDEX "idx_learning_progress_user_recent" ON "learning_progress" USING btree ("user_id","last_accessed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_payment_orders_provider_ref" ON "payment_orders" USING btree ("provider_ref");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_user" ON "payment_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_quick_tips_category_status" ON "quick_tip_lessons" USING btree ("category","status");--> statement-breakpoint
CREATE INDEX "idx_reading_blocks_chapter_position" ON "reading_blocks" USING btree ("chapter_id","position");--> statement-breakpoint
CREATE INDEX "idx_reading_chapters_item_position" ON "reading_chapters" USING btree ("item_id","position");--> statement-breakpoint
CREATE INDEX "idx_reading_items_status_category" ON "reading_items" USING btree ("status","category");--> statement-breakpoint
CREATE INDEX "idx_referral_signups_inviter" ON "referral_signups" USING btree ("inviter_user_id","confirmed_at");--> statement-breakpoint
CREATE INDEX "idx_routine_lessons_status_created" ON "routine_lessons" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_saved_routines_user_lesson" ON "saved_routines" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_saved_sentences_user_lesson_start" ON "saved_sentences" USING btree ("user_id","lesson_id","start_ms");--> statement-breakpoint
CREATE INDEX "idx_saved_sentences_user_created" ON "saved_sentences" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_saved_vocabulary_user_word" ON "saved_vocabulary" USING btree ("user_id","word");--> statement-breakpoint
CREATE INDEX "idx_speaking_recordings_user_lesson" ON "speaking_recordings" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "idx_support_messages_ticket" ON "support_messages" USING btree ("ticket_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_support_messages_author" ON "support_messages" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_support_user_updated" ON "support_tickets" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_support_status_updated" ON "support_tickets" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "idx_user_admin_audit_target" ON "user_admin_audit" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "idx_video_lessons_status_category" ON "video_lessons" USING btree ("status","category");
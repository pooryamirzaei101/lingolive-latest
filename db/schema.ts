import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const videoLessons = sqliteTable("video_lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  contentKind: text("content_kind").notNull().default("video"),
  level: text("level").notNull().default("Beginner"),
  tags: text("tags").notNull().default(""),
  mediaKey: text("media_key").notNull(),
  mimeType: text("mime_type").notNull(),
  sourceUrl: text("source_url"),
  transcriptionKey: text("transcription_key"),
  displayFormat: text("display_format").notNull().default("landscape"),
  transcript: text("transcript").notNull().default("[]"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_video_lessons_status_category").on(table.status, table.category)]);

export const videoCategories = sqliteTable("video_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  section: text("section").notNull().default("video"),
  parentId: text("parent_id"),
  createdAt: integer("created_at").notNull(),
});

export const hiddenSamples = sqliteTable("hidden_samples", {
  id: text("id").primaryKey(),
  hiddenAt: integer("hidden_at").notNull(),
});

export const speakingRecordings = sqliteTable("speaking_recordings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  mediaKey: text("media_key").notNull(),
  mimeType: text("mime_type").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_speaking_recordings_user_lesson").on(table.userId, table.lessonId)]);

export const readingItems = sqliteTable("reading_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  level: text("level").notNull().default("Beginner"),
  documentKey: text("document_key"),
  documentMimeType: text("document_mime_type"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_reading_items_status_category").on(table.status, table.category)]);

export const readingChapters = sqliteTable("reading_chapters", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull(),
  position: integer("position").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  translation: text("translation").notNull().default(""),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_reading_chapters_item_position").on(table.itemId, table.position)]);

export const routineLessons = sqliteTable("routine_lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("daily-everyday"),
  phrase: text("phrase").notNull(),
  phraseTranslation: text("phrase_translation").notNull().default(""),
  explanation: text("explanation").notNull(),
  exampleOne: text("example_one").notNull(),
  exampleOneTranslation: text("example_one_translation").notNull().default(""),
  exampleTwo: text("example_two").notNull(),
  exampleTwoTranslation: text("example_two_translation").notNull().default(""),
  body: text("body").notNull().default(""),
  audioKey: text("audio_key"),
  mimeType: text("mime_type"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_routine_lessons_status_created").on(table.status, table.createdAt)]);

export const savedRoutines = sqliteTable("saved_routines", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("idx_saved_routines_user_lesson").on(table.userId,table.lessonId)]);

export const ieltsSpeakingExamples = sqliteTable("ielts_speaking_examples", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  cue: text("cue").notNull().default(""),
  answer: text("answer").notNull(),
  translation: text("translation").notNull().default(""),
  audioKey: text("audio_key"),
  mimeType: text("mime_type"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_ielts_speaking_category_status").on(table.category, table.status)]);

export const quickTipLessons = sqliteTable("quick_tip_lessons", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  translation: text("translation").notNull().default(""),
  example: text("example").notNull().default(""),
  exampleTranslation: text("example_translation").notNull().default(""),
  audioKey: text("audio_key"),
  mimeType: text("mime_type"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_quick_tips_category_status").on(table.category, table.status)]);

export const learnerPreferences = sqliteTable("learner_preferences", {
  userId: text("user_id").primaryKey(),
  translationLanguage: text("translation_language").notNull().default("fa"),
});

export const savedVocabulary = sqliteTable("saved_vocabulary", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull().default(""),
  translationLanguage: text("translation_language").notNull().default("fa"),
  sourceLessonId: text("source_lesson_id").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_saved_vocabulary_user_word").on(table.userId, table.word)]);

export const savedSentences = sqliteTable("saved_sentences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  lessonTitle: text("lesson_title").notNull(),
  section: text("section").notNull(),
  start: integer("start_ms").notNull(),
  english: text("english").notNull(),
  translation: text("translation").notNull().default(""),
  createdAt: integer("created_at").notNull(),
}, (table) => [uniqueIndex("idx_saved_sentences_user_lesson_start").on(table.userId,table.lessonId,table.start),index("idx_saved_sentences_user_created").on(table.userId,table.createdAt)]);

export const mediaIntegrations = sqliteTable("media_integrations", {
  id: text("id").primaryKey(),
  assemblyKey: text("assembly_key").notNull().default(""),
  googleKey: text("google_key").notNull().default(""),
  youtubeClientId:text("youtube_client_id").notNull().default(""),
  youtubeClientSecret:text("youtube_client_secret").notNull().default(""),
  youtubeRefreshToken:text("youtube_refresh_token").notNull().default(""),
  enabled: integer("enabled").notNull().default(0),
});
export const transcriptJobs = sqliteTable("transcript_jobs", {
  lessonId: text("lesson_id").primaryKey(),
  providerId: text("provider_id").notNull().default(""),
  state: text("state").notNull(),
  languages: text("languages").notNull().default("[]"),
  segments: text("segments").notNull().default("[]"),
  cursor: integer("cursor").notNull().default(0),
  error: text("error").notNull().default(""),
  createdAt: integer("created_at").notNull(),
});

export const translationCache = sqliteTable("translation_cache", {
 id:text("id").primaryKey(), english:text("english").notNull(), language:text("language").notNull(),
 translation:text("translation").notNull().default(""), source:text("source").notNull().default("provider"),
 state:text("state").notNull().default("pending"), updatedAt:integer("updated_at").notNull(),
});
export const translationUsage = sqliteTable("translation_usage", {
 id:text("id").primaryKey(), count:integer("count").notNull().default(0), characters:integer("characters").notNull().default(0),
});
export const mediaTranscripts = sqliteTable("media_transcripts", {
 id:text("id").primaryKey(), segments:text("segments").notNull().default("[]"),
});

export const paymentSettings = sqliteTable("payment_settings", {
 id:text("id").primaryKey(), pricingRevision:integer("pricing_revision").notNull().default(0), iranMonthly:integer("iran_monthly").notNull().default(400000), iranAnnual:integer("iran_annual").notNull().default(1000000),
 internationalMonthly:integer("international_monthly").notNull().default(0), internationalAnnual:integer("international_annual").notNull().default(0), currency:text("currency").notNull().default("eur"),
 iranEnabled:integer("iran_enabled").notNull().default(0), internationalEnabled:integer("international_enabled").notNull().default(0),
 merchantKey:text("merchant_key").notNull().default(""), stripeKey:text("stripe_key").notNull().default(""), webhookKey:text("webhook_key").notNull().default(""),
});
export const paymentOrders = sqliteTable("payment_orders", {
 id:text("id").primaryKey(),userId:text("user_id").notNull(),provider:text("provider").notNull(),plan:text("plan").notNull(),amount:integer("amount").notNull(),currency:text("currency").notNull(),
 providerRef:text("provider_ref"),status:text("status").notNull().default("pending"),createdAt:integer("created_at").notNull(),paidAt:integer("paid_at"),expiresAt:integer("expires_at"),
},t=>[uniqueIndex("idx_payment_orders_provider_ref").on(t.providerRef),index("idx_payment_orders_user").on(t.userId)]);
export const memberships = sqliteTable("memberships", {
 userId:text("user_id").primaryKey(),expiresAt:integer("expires_at").notNull(),subscriptionId:text("subscription_id"),customerId:text("customer_id"),
});
export const contentAccess = sqliteTable("content_access", { id:text("id").primaryKey(),free:integer("free").notNull().default(0) });

export const learnerProfiles=sqliteTable("learner_profiles",{
 userId:text("user_id").primaryKey(),isPending:integer("is_pending").notNull().default(0),pendingEmail:text("pending_email"),email:text("email").notNull(),displayName:text("display_name").notNull(),
 country:text("country").notNull().default(""),level:text("level").notNull().default(""),purpose:text("purpose").notNull().default(""),
 newsletterConsent:integer("newsletter_consent").notNull().default(0),newsletterConsentAt:integer("newsletter_consent_at"),
 completedAt:integer("completed_at"),createdAt:integer("created_at").notNull(),updatedAt:integer("updated_at").notNull(),lastSeenAt:integer("last_seen_at").notNull(),
},t=>[uniqueIndex("idx_learner_profiles_pending_email").on(t.pendingEmail),index("idx_learner_profiles_created").on(t.createdAt),index("idx_learner_profiles_country").on(t.country)]);

export const premiumGrants=sqliteTable("premium_grants",{
 userId:text("user_id").primaryKey(),expiresAt:integer("expires_at").notNull(),grantedBy:text("granted_by").notNull(),updatedAt:integer("updated_at").notNull(),
});
export const userAdminAudit=sqliteTable("user_admin_audit",{
 id:text("id").primaryKey(),actorId:text("actor_id").notNull(),targetId:text("target_id").notNull(),action:text("action").notNull(),expiresAt:integer("expires_at"),createdAt:integer("created_at").notNull(),
},t=>[index("idx_user_admin_audit_target").on(t.targetId)]);

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
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_reading_items_status_category").on(table.status, table.category)]);

export const readingChapters = sqliteTable("reading_chapters", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull(),
  position: integer("position").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_reading_chapters_item_position").on(table.itemId, table.position)]);

export const routineLessons = sqliteTable("routine_lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
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

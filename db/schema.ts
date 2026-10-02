import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

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

export const learnerPreferences = sqliteTable("learner_preferences", {
  userId: text("user_id").primaryKey(),
  translationLanguage: text("translation_language").notNull().default("fa"),
});

export const savedVocabulary = sqliteTable("saved_vocabulary", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull().default(""),
  sourceLessonId: text("source_lesson_id").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_saved_vocabulary_user_word").on(table.userId, table.word)]);

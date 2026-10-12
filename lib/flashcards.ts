import {and,desc,eq} from "drizzle-orm";
import {getDb} from "@/db";
import {quickTipLessons} from "@/db/schema";

export type Flashcard=typeof quickTipLessons.$inferSelect;
export const FLASHCARD_CATEGORY="flashcards";
export async function listFlashcards(includeDrafts=false){return getDb().select().from(quickTipLessons).where(includeDrafts?eq(quickTipLessons.category,FLASHCARD_CATEGORY):and(eq(quickTipLessons.category,FLASHCARD_CATEGORY),eq(quickTipLessons.status,"published"))).orderBy(desc(quickTipLessons.createdAt)).all()}
export async function getFlashcard(id:string,includeDraft=false){const card=await getDb().select().from(quickTipLessons).where(and(eq(quickTipLessons.id,id),eq(quickTipLessons.category,FLASHCARD_CATEGORY))).get();return card&&(includeDraft||card.status==="published")?card:undefined}

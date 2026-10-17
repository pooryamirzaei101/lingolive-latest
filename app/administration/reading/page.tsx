import { AdminSamples } from "@/components/admin-samples";
import { asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { readingBlocks, readingChapters, readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { CategoryManager } from "@/components/video-admin";
import { ReadingCreate, ReadingItemEditor } from "@/components/reading-admin";
export const dynamic="force-dynamic";
export default async function ReadingAdministration(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  try{const [categories,items,chapters,blocks]=await Promise.all([getVideoCategories("reading"),getDb().select().from(readingItems).orderBy(desc(readingItems.createdAt)).all(),getDb().select().from(readingChapters).orderBy(asc(readingChapters.position)).all(),getDb().select().from(readingBlocks).orderBy(asc(readingBlocks.position)).all()]);return <section className="section shell admin-page"><a href="/administration" className="folder-back">← Administration</a><span className="section-eyebrow">ADMINISTRATION</span><h1>Reading Room studio</h1><p>Open a folder, organize lessons into units, and add text, slides, PDFs, pictures, or voice between passages. Students see only published lessons.</p><CategoryManager categories={categories} section="reading"/><div className="detail-grid"><div className="detail-panel"><h2>Reading lessons</h2>{items.length?items.map(item=><ReadingItemEditor key={item.id} item={item} categories={categories} chapters={chapters.filter(chapter=>chapter.itemId===item.id)} blocks={blocks.filter(block=>chapters.some(chapter=>chapter.itemId===item.id&&chapter.id===block.chapterId))}/>):<p>No reading lessons yet. Create your first draft.</p>}</div><aside className="detail-panel" id="add-content"><h2>New reading lesson</h2><ReadingCreate categories={categories}/></aside></div><AdminSamples section="reading"/></section>}catch{return <section className="section shell"><h1>Reading Room studio</h1><p className="notice">The reading database is temporarily unavailable. Please try again later.</p></section>}
}

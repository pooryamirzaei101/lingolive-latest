import { AdminSamples } from "@/components/admin-samples";
import { desc, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { CategoryManager } from "@/components/video-admin";
import { QuickTipCreate, QuickTipEditor } from "@/components/quick-tip-admin";
export const dynamic="force-dynamic";
export default async function QuickTipsAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  try{const [categories,tips]=await Promise.all([getVideoCategories("tips"),getDb().select().from(quickTipLessons).where(ne(quickTipLessons.category,"flashcards")).orderBy(desc(quickTipLessons.createdAt)).all()]);return <section className="section shell admin-page"><a className="folder-back" href="/administration">← Administration</a><span className="section-eyebrow">ADMINISTRATION · QUICK TIPS</span><h1>Quick Tips studio</h1><p>Create folders and short lessons with audio at the top and English text below. Add a translation and example, preview the draft, then publish it.</p><CategoryManager categories={categories} section="tips"/><div className="detail-grid"><div className="detail-panel"><h2>Quick Tips lessons</h2>{tips.length?tips.map(tip=><QuickTipEditor key={tip.id} tip={tip} categories={categories}/>):<p>No admin-created tips yet. Three short sample tips are visible to students.</p>}</div><aside className="detail-panel" id="add-content"><h2>Add a Quick Tip</h2><QuickTipCreate categories={categories}/></aside></div><AdminSamples section="tips"/></section>}catch{return <section className="section shell"><h1>Quick Tips studio</h1><p className="notice">The lesson database is temporarily unavailable. Please try again later.</p></section>}
}

import { AdminSamples } from "@/components/admin-samples";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { CategoryManager } from "@/components/video-admin";
import { IeltsSpeakingCreate, IeltsSpeakingEditor } from "@/components/ielts-speaking-admin";
import {IeltsModuleCreate,IeltsModuleEditor} from '@/components/ielts-module-admin';
export const dynamic="force-dynamic";
export default async function IeltsAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  try{const [categories,examples]=await Promise.all([getVideoCategories("ielts"),getDb().select().from(ieltsSpeakingExamples).orderBy(desc(ieltsSpeakingExamples.createdAt)).all()]);return <section className="section shell admin-page"><a href="/administration" className="folder-back">← Administration</a><span className="section-eyebrow">ADMINISTRATION · IELTS</span><h1>IELTS Examples studio</h1><p>Create Listening audio with reviewed timestamps, Academic or General Training Reading lessons, and Speaking videos with teleprompter cues. Podcasts share the synchronized transcript player in the Podcasts studio.</p><CategoryManager categories={categories} section="ielts"/><div className="detail-grid"><div className="detail-panel"><h2>IELTS examples</h2>{examples.length?examples.map(example=>example.kind==='reading'||example.kind==='speaking_video'?<IeltsModuleEditor key={example.id} example={example} categories={categories}/>:<IeltsSpeakingEditor key={example.id} example={example} categories={categories}/>):<p>No admin-created examples yet. Short sample questions are already visible to students.</p>}</div><aside className="detail-panel" id="add-content"><h2>Add interactive content</h2><IeltsSpeakingCreate categories={categories}/><IeltsModuleCreate categories={categories} kind="reading"/><IeltsModuleCreate categories={categories} kind="speaking_video"/></aside></div><AdminSamples section="ielts"/></section>}catch{return <section className="section shell"><h1>IELTS Examples studio</h1><p className="notice">The example database is temporarily unavailable. Please try again later.</p></section>}
}

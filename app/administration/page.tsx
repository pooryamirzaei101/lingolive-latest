import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { CategoryManager, VideoEditor, VideoUpload } from "@/components/video-admin";
import { getVideoCategories } from "@/lib/video-categories";
import type { VideoCategory } from "@/lib/video";
export const dynamic="force-dynamic";
export default async function Administration(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  let lessons:typeof videoLessons.$inferSelect[]=[],categories:VideoCategory[]=[];let error=false;try{const [records,video,speaking]=await Promise.all([getDb().select().from(videoLessons).orderBy(desc(videoLessons.createdAt)).all(),getVideoCategories("video"),getVideoCategories("speaking")]);lessons=records;categories=[...video,...speaking]}catch{error=true}
  return <section className="section shell admin-page"><span className="section-eyebrow">ADMINISTRATION</span><h1>Video lesson studio</h1><p>Manage folders and subcategories for Video Lessons and Speaking Practice. Upload a video, review its transcript, and publish it.</p><p><Link className="button secondary" href="/administration/reading">Open Reading Room studio</Link></p>{error?<p className="notice">The content database is temporarily unavailable. Please try again later.</p>:<><CategoryManager categories={categories} section="video"/><CategoryManager categories={categories} section="speaking"/><div className="detail-grid"><div className="detail-panel"><h2>Lessons</h2>{lessons.length===0?<p>No video lessons uploaded yet.</p>:lessons.map(l=><article className="admin-lesson" key={l.id}><div><strong>{l.title}</strong><small>{categories.find(c=>c.id===l.category||c.legacy===l.category)?.name||l.category} · {l.contentKind==="speaking"?"Speaking Practice":"Video Lessons"} · {l.status}</small><Link href={`/video-lessons/${l.id}`}>Preview lesson</Link></div><VideoEditor id={l.id} initial={l.transcript} status={l.status} category={l.category} categories={categories}/></article>)}</div><aside className="detail-panel"><h2>Upload a video</h2><VideoUpload categories={categories}/></aside></div></>}</section>}

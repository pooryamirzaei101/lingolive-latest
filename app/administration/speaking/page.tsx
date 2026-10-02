import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { CategoryManager, VideoEditor, VideoUpload } from "@/components/video-admin";
export const dynamic="force-dynamic";
export default async function SpeakingAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  try{const [categories,lessons]=await Promise.all([getVideoCategories("speaking"),getDb().select().from(videoLessons).where(eq(videoLessons.contentKind,"speaking")).orderBy(desc(videoLessons.createdAt)).all()]);return <section className="section shell admin-page"><Link href="/administration" className="folder-back">← Administration</Link><span className="section-eyebrow">ADMINISTRATION</span><h1>Speaking Practice studio</h1><p>Upload a speaking video, write its timed teleprompter lines, preview the lesson, then publish it. Only the administrator can add videos.</p><CategoryManager categories={categories} section="speaking"/><div className="detail-grid"><div className="detail-panel"><h2>Speaking videos</h2>{lessons.length?lessons.map(lesson=><article className="admin-lesson" key={lesson.id}><div><strong>{lesson.title}</strong><small>{categories.find(category=>category.id===lesson.category)?.name||lesson.category} · {lesson.status}</small><Link href={`/video-lessons/${lesson.id}`}>Preview video</Link></div><VideoEditor id={lesson.id} initial={lesson.transcript} status={lesson.status} category={lesson.category} categories={categories} contentKind="speaking"/></article>):<p>No speaking videos uploaded yet.</p>}</div><aside className="detail-panel"><h2>Upload speaking video</h2><VideoUpload categories={categories} initialSection="speaking" lockedSection/></aside></div></section>}catch{return <section className="section shell"><h1>Speaking Practice studio</h1><p className="notice">The speaking content database is temporarily unavailable. Please try again later.</p></section>}
}

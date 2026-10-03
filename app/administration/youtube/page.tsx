import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { CategoryManager, VideoEditor, VideoUpload } from "@/components/video-admin";
export const dynamic="force-dynamic";
export default async function YouTubeAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  try{const [categories,lessons]=await Promise.all([getVideoCategories("youtube"),getDb().select().from(videoLessons).where(eq(videoLessons.contentKind,"youtube")).orderBy(desc(videoLessons.createdAt)).all()]);return <section className="section shell admin-page"><Link href="/administration" className="folder-back">← Administration</Link><span className="section-eyebrow">ADMINISTRATION</span><h1>YouTube Videos studio</h1><p>Add an approved YouTube video or Shorts link and manually enter a reviewed English and Persian transcript. YouTube hosts and plays the video.</p><CategoryManager categories={categories} section="youtube"/><div className="detail-grid"><div className="detail-panel"><h2>YouTube lessons</h2>{lessons.length?lessons.map(lesson=><article className="admin-lesson" key={lesson.id}><details><summary><strong>{lesson.title}</strong> · {lesson.status}</summary><Link href={`/video-lessons/${lesson.id}`}>Preview lesson</Link><VideoEditor id={lesson.id} initial={lesson.transcript} status={lesson.status} category={lesson.category} categories={categories} contentKind="youtube" title={lesson.title} description={lesson.description} level={lesson.level} displayFormat={lesson.displayFormat} sourceUrl={lesson.sourceUrl}/></details></article>):<p>No YouTube lessons added yet.</p>}</div><aside className="detail-panel"><h2>Add a YouTube lesson</h2><VideoUpload categories={categories} initialSection="youtube" lockedSection/></aside></div></section>}catch{return <section className="section shell"><h1>YouTube Videos studio</h1><p className="notice">The video database is temporarily unavailable. Please try again later.</p></section>}
}

import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { VideoEditor, VideoUpload } from "@/components/video-admin";
export const dynamic="force-dynamic";
export default async function Administration(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  let lessons:typeof videoLessons.$inferSelect[]=[];let error=false;try{lessons=await getDb().select().from(videoLessons).orderBy(desc(videoLessons.createdAt)).all()}catch{error=true}
  return <section className="section shell admin-page"><span className="section-eyebrow">ADMINISTRATION</span><h1>Video lesson studio</h1><p>Upload a lesson as a draft, review its timed English and Persian transcript, then publish it.</p>{error?<p className="notice">The content database is temporarily unavailable. Please try again later.</p>:<div className="detail-grid"><div className="detail-panel"><h2>Lessons</h2>{lessons.length===0?<p>No video lessons uploaded yet.</p>:lessons.map(l=><article className="admin-lesson" key={l.id}><div><strong>{l.title}</strong><small>{l.category} · {l.status}</small><Link href={`/video-lessons/${l.id}`}>Preview lesson</Link></div><VideoEditor id={l.id} initial={l.transcript} status={l.status}/></article>)}</div><aside className="detail-panel"><h2>Upload a video</h2><VideoUpload/></aside></div>}</section>}

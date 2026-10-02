import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, or } from "drizzle-orm";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { DEFAULT_VIDEO_CATEGORIES } from "@/lib/video";
import { getVideoCategories } from "@/lib/video-categories";
import { isAdmin } from "@/lib/admin";
export const dynamic="force-dynamic";
export function generateStaticParams(){return DEFAULT_VIDEO_CATEGORIES.map(item=>({slug:item.id}))}
export default async function VideoFolder({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;let categories;try{categories=await getVideoCategories()}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again.</p></section>}const category=categories.find(c=>c.id===slug);if(!category)notFound();
  let lessons:typeof videoLessons.$inferSelect[]=[];let unavailable=false;
  try{lessons=await getDb().select().from(videoLessons).where(and(eq(videoLessons.status,"published"),or(eq(videoLessons.category,category.id),category.legacy?eq(videoLessons.category,category.legacy):undefined))).orderBy(desc(videoLessons.createdAt)).all()}catch{unavailable=true}
  const admin=await isAdmin();
  return <section className="section shell catalog-page"><Link className="folder-back" href="/video-lessons"><ArrowLeft size={18}/> All video folders</Link><div className="folder-heading"><span className="folder-icon"><FolderOpen size={30}/></span><div><span className="section-eyebrow">VIDEO LESSONS</span><h1>{category.name}</h1><p>{lessons.length} published {lessons.length===1?"lesson":"lessons"}</p></div></div>{unavailable?<p className="notice">This folder is temporarily unavailable. Please try again.</p>:lessons.length?<div className="lesson-grid">{lessons.map(lesson=><Link className="lesson-card" href={`/video-lessons/${lesson.id}`} key={lesson.id}><div className="lesson-content"><div className="card-meta"><span>{lesson.level}</span></div><h2>{lesson.title}</h2><p>{lesson.description||"Watch and practice with subtitles."}</p><span className="text-link">Open lesson</span></div></Link>)}</div>:<div className="folder-empty"><FolderOpen size={43}/><h2>No published videos in this folder yet</h2><p>This folder opens correctly, but it has no lessons to watch. A video will appear here after the administrator uploads it, reviews its transcript, and publishes it.</p>{admin&&<Link className="button primary" href="/administration">Add a video lesson</Link>}<Link className="button secondary" href="/lessons">Try a sample lesson</Link></div>}</section>
}

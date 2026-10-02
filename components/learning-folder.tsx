import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, or } from "drizzle-orm";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { getVideoCategories } from "@/lib/video-categories";
import { isAdmin } from "@/lib/admin";
import type { ContentSection } from "@/lib/video";
import { newsExample, videoExample } from "@/lib/video-example";

export async function LearningFolder({section,id}:{section:ContentSection;id:string}){
  const root=section==="speaking"?"/speaking-practice":"/video-lessons",title=section==="speaking"?"Speaking Practice":id==="news"?"News":"Video Lessons";
  let categories;try{categories=await getVideoCategories(section)}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again.</p></section>}
  const category=categories.find(c=>c.id===id);if(!category)notFound();
  const parent=categories.find(c=>c.id===category.parentId),children=categories.filter(c=>c.parentId===category.id);
  let lessons:typeof videoLessons.$inferSelect[]=[],unavailable=false;
  try{lessons=await getDb().select().from(videoLessons).where(and(eq(videoLessons.status,"published"),eq(videoLessons.contentKind,section),or(eq(videoLessons.category,category.id),category.legacy?eq(videoLessons.category,category.legacy):undefined))).orderBy(desc(videoLessons.createdAt)).all()}catch{unavailable=true}
  const admin=await isAdmin();
  const sample=section==="video"?[videoExample,newsExample].find(item=>item.category===id):undefined;
  return <section className="section shell catalog-page"><Link className="folder-back" href={parent?`${root}/categories/${parent.id}`:root}><ArrowLeft size={18}/>{parent?parent.name:`All ${title} folders`}</Link><div className="folder-heading"><span className="folder-icon"><FolderOpen size={30}/></span><div><span className="section-eyebrow">{title.toUpperCase()}</span><h1>{category.name}</h1><p>{lessons.length} published {lessons.length===1?"video":"videos"}{sample?" · 1 sample video":""}</p></div></div>{children.length>0&&<><h2>Subcategories</h2><div className="video-folder-grid">{children.map(child=><Link className="video-folder-card" href={`${root}/categories/${child.id}`} key={child.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{child.name}</h2><span className="folder-open">Open folder</span></Link>)}</div></>}{unavailable&&<p className="notice">Published lessons are temporarily unavailable. Please try again.</p>}{(lessons.length>0||sample)&&<><h2>Videos</h2><div className="lesson-grid">{sample&&<Link className="lesson-card" href={`/video-lessons/${sample.id}`}><div className="lesson-content"><span className="section-eyebrow">SAMPLE · {sample.level}</span><h2>{sample.title}</h2><p>{sample.description}</p><span className="text-link">Open video</span></div></Link>}{lessons.map(lesson=><Link className="lesson-card" href={`/video-lessons/${lesson.id}`} key={lesson.id}><div className="lesson-content"><div className="card-meta"><span>{lesson.level}</span></div><h2>{lesson.title}</h2><p>{lesson.description||"Watch and practice with subtitles."}</p><span className="text-link">Open video</span></div></Link>)}</div></>}{!lessons.length&&!sample&&<div className="folder-empty"><FolderOpen size={43}/><h2>This folder is open. No videos have been published here yet</h2><p>The administrator can upload a video here, review its transcript, and publish it.</p>{admin&&<Link className="button primary" href="/administration">Add a video</Link>}<Link className="button secondary" href={root}>Browse other folders</Link></div>}</section>
}

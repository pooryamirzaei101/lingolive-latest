import { notFound } from "next/navigation";
import { and, desc, eq, or } from "drizzle-orm";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { getVideoCategories } from "@/lib/video-categories";
import type { ContentSection } from "@/lib/video";
import { newsExample, speakingVideoExample, videoExample } from "@/lib/video-example";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { isSampleHidden } from "@/lib/sample-visibility";

export async function LearningFolder({section,id,news=false}:{section:ContentSection;id:string;news?:boolean}){
  const root=news?"/news":section==="speaking"?"/speaking-practice":section==="youtube"?"/youtube-videos":"/video-lessons",title=news?"News":section==="speaking"?"Speaking Practice":section==="youtube"?"YouTube Lessons":"Video Lessons";
  let categories;try{categories=await getVideoCategories(section)}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again.</p></section>}
  const category=categories.find(c=>c.id===id);if(!category)notFound();
  const parent=categories.find(c=>c.id===category.parentId),children=categories.filter(c=>c.parentId===category.id);
  let lessons:typeof videoLessons.$inferSelect[]=[],unavailable=false;
  try{lessons=await getDb().select().from(videoLessons).where(and(eq(videoLessons.status,"published"),eq(videoLessons.contentKind,section),or(eq(videoLessons.category,category.id),category.legacy?eq(videoLessons.category,category.legacy):undefined))).orderBy(desc(videoLessons.createdAt)).all()}catch{unavailable=true}
  const candidate=section==="video"?[videoExample,newsExample].find(item=>item.category===id):section==="speaking"&&id===speakingVideoExample.category?speakingVideoExample:undefined;
  const sample=candidate&&!await isSampleHidden(candidate.id)?candidate:undefined;
  const parentHref=parent?(news&&parent.id==="news"?"/news":`${root}/categories/${parent.id}`):root;
  return <section className="section shell catalog-page"><a className="folder-back" href={parentHref}><ArrowLeft size={18}/>{parent?parent.name:`All ${title} folders`}</a><div className="folder-heading"><span className="folder-icon"><FolderOpen size={30}/></span><div><span className="section-eyebrow">{title.toUpperCase()}</span><h1>{category.name}</h1><p>{lessons.length} published {lessons.length===1?"video":"videos"}{sample?" · 1 sample video":""}</p></div></div>{section==="speaking"&&<p><a className="button secondary" href="/speaking-practice/recordings">My Voices</a></p>}{children.length>0&&<><h2>Subcategories</h2><div className="video-folder-grid">{children.map(child=><a className="video-folder-card" href={`${root}/categories/${child.id}`} key={child.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{child.name}</h2><span className="folder-open">Open folder</span></a>)}</div></>}{unavailable&&<p className="notice">Published lessons are temporarily unavailable. Please try again.</p>}{(lessons.length>0||sample)&&<><h2>Videos</h2><div className="lesson-grid folder-video-rows">{sample&&<a className="lesson-card" href={`/video-lessons/${sample.id}`}><div className="lesson-content"><span className="section-eyebrow">SAMPLE · {sample.level}</span><h2>{sample.title}</h2><p>{sample.description}</p><span className="text-link">Open video</span></div></a>}{lessons.map(lesson=><a className="lesson-card" href={`/video-lessons/${lesson.id}`} key={lesson.id}><VideoThumbnail id={lesson.id} format={lesson.displayFormat} thumbnailKey={lesson.thumbnailKey} settings={lesson.thumbnailSettings} title={lesson.title}/><div className="lesson-content"><div className="card-meta"><span>{lesson.level}</span></div><h2>{lesson.title}</h2><p>{lesson.description||"Watch and practice with subtitles."}</p><span className="text-link">Open video</span></div></a>)}</div></>}{!lessons.length&&!sample&&<div className="folder-empty"><FolderOpen size={43}/><h2>No videos have been published in this folder yet</h2><p>New lessons will appear here when they are ready.</p><a className="button secondary" href={root}>Browse other folders</a></div>}</section>
}

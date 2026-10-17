import {VideoThumbnail} from "@/components/video-thumbnail";
import {canLearn} from '@/lib/membership';
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import { isLearningSection, learningSections } from "@/lib/section-folders";
import { lessons } from "@/lib/content";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples, videoLessons } from "@/db/schema";
import { ieltsSamples } from "@/lib/ielts-speaking";
import { listQuickTips } from "@/lib/quick-tips";
import { listRoutines } from "@/lib/routines";
import { hiddenSampleIds } from "@/lib/sample-visibility";

export const dynamic="force-dynamic";
export default async function SectionFolderPage({params}:{params:Promise<{section:string;id:string}>}){
  const {section,id}=await params;
  if(section==="ielts-examples"||!isLearningSection(section))notFound();
  const config=learningSections[section];
  let categories:Awaited<ReturnType<typeof getVideoCategories>>;
  try{categories=await getVideoCategories(config.section)}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again later.</p></section>}
  const folder=categories.find(category=>category.id===id);
  if(!folder)notFound();
  const parent=categories.find(category=>category.id===folder.parentId),children=categories.filter(category=>category.parentId===id);
  const hidden=await hiddenSampleIds(),sample=id===config.sampleCategory&&!hidden.has(section==="ielts-examples"?"sample-reading":config.sample)?lessons.find(lesson=>lesson.slug===config.sample):undefined;
  let examples=section==="ielts-examples"?ieltsSamples.filter(item=>item.category===id&&!hidden.has(item.id)).map(item=>({id:item.id,question:item.question})):[],examplesUnavailable=false;
  if(section==="ielts-examples"){try{const records=await getDb().select().from(ieltsSpeakingExamples).where(and(eq(ieltsSpeakingExamples.category,id),eq(ieltsSpeakingExamples.status,"published"))).all();examples=[...examples,...records.map(item=>({id:item.id,question:item.question}))]}catch{examplesUnavailable=true}}
  let tips:Awaited<ReturnType<typeof listQuickTips>>=[];
  if(section==="quick-tips"){try{tips=(await listQuickTips()).filter(tip=>tip.category===id)}catch{examplesUnavailable=true}}
  let youtubeLessons:typeof videoLessons.$inferSelect[]=[];
  if(section==="youtube-videos"){try{youtubeLessons=await getDb().select().from(videoLessons).where(and(eq(videoLessons.category,id),eq(videoLessons.status,"published"),eq(videoLessons.contentKind,"youtube"))).all()}catch{examplesUnavailable=true}}
  let routines:Awaited<ReturnType<typeof listRoutines>>=[];
  if(section==="daily-lessons"){try{routines=(await listRoutines()).filter(lesson=>lesson.category===id)}catch{examplesUnavailable=true}}
  const tipAccess=new Set((await Promise.all(tips.map(async i=>await canLearn('tips',i.id)?i.id:''))).filter(Boolean)),routineAccess=new Set((await Promise.all(routines.map(async i=>await canLearn('routine',i.id)?i.id:''))).filter(Boolean));
  return <section className="section shell catalog-page">
    <a className="folder-back" href={parent?`/${section}/categories/${parent.id}`:`/${section}`}><ArrowLeft size={18}/>{parent?parent.name:`All ${config.title} folders`}</a>
    <span className="section-eyebrow">{config.title.toUpperCase()} · OPEN FOLDER</span><h1>{folder.name}</h1>
    {children.length>0&&<div className="video-folder-grid">{children.map(child=><a className="video-folder-card" href={`/${section}/categories/${child.id}`} aria-label={`Open ${child.name} folder`} key={child.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{child.name}</h2><span className="folder-open">Open folder</span></a>)}</div>}
    {examplesUnavailable&&<p className="notice">Some published questions are temporarily unavailable. You can still open the sample questions.</p>}
    {examples.length>0&&<div className="speaking-question-list"><h2>Questions and model answers</h2><p>Select a question to listen and read its model answer.</p>{examples.map((item,index)=><a className="speaking-question-row" href={`/ielts-examples/practice/${item.id}`} key={item.id}><span className="speaking-question-number">{index+1}</span><strong>{item.question}</strong><span aria-hidden="true">›</span></a>)}</div>}
    {tips.length>0&&<div className="lesson-grid">{tips.map(tip=><a className="lesson-card" href={`/quick-tips/lessons/${tip.id}`} key={tip.id}><div className="lesson-content"><span className="section-eyebrow">QUICK TIP · LISTEN & READ</span><h2>{tip.title}</h2><p>{tipAccess.has(tip.id)?tip.body:'Included in Membership.'}</p><span className="text-link">Open lesson</span></div></a>)}</div>}
    {youtubeLessons.length>0&&<div className="lesson-grid">{youtubeLessons.map(lesson=><a className="lesson-card" href={`/video-lessons/${lesson.id}`} key={lesson.id}><VideoThumbnail id={lesson.id} format={lesson.displayFormat} thumbnailKey={lesson.thumbnailKey} settings={lesson.thumbnailSettings} title={lesson.title}/><div className="lesson-content"><span className="section-eyebrow">YOUTUBE VIDEO · {lesson.level}</span><h2>{lesson.title}</h2><p>{lesson.description}</p><span className="text-link">Open lesson</span></div></a>)}</div>}
    {routines.length>0&&<div className="lesson-grid">{routines.map(lesson=><a className="lesson-card" href={`/daily-lessons/routines/${lesson.id}`} key={lesson.id}><div className="lesson-content"><span className="section-eyebrow">DAILY LESSON · LISTEN & READ</span><h2>{lesson.title}</h2><p>{routineAccess.has(lesson.id)?lesson.explanation:'Included in Membership.'}</p><span className="text-link">Open lesson</span></div></a>)}</div>}
    {sample&&section!=="quick-tips"&&section!=="daily-lessons"?<div className="lesson-grid"><a className="lesson-card" href={section==="ielts-examples"?"/ielts-examples/sample-reading":`/lessons/${sample.slug}`}><div className="lesson-content"><span className="section-eyebrow">SAMPLE · {sample.level}</span><h2>{section==="ielts-examples"?"Read a Library Notice":sample.title}</h2><p>{section==="ielts-examples"?"Read a short notice and answer two questions with feedback.":sample.description}</p><span className="text-link">Open lesson</span></div></a></div>:children.length===0&&examples.length===0&&tips.length===0&&youtubeLessons.length===0&&routines.length===0?<div className="folder-empty"><FolderOpen size={40}/><h2>This folder is open</h2><p>No lessons have been published here yet. The administrator can add content later.</p></div>:null}
  </section>
}

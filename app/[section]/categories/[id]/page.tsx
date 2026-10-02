import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import { isLearningSection, learningSections } from "@/lib/section-folders";
import { lessons } from "@/lib/content";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isSpeakingFolder, speakingSamples } from "@/lib/ielts-speaking";

export const dynamic="force-dynamic";
export default async function SectionFolderPage({params}:{params:Promise<{section:string;id:string}>}){
  const {section,id}=await params;
  if(!isLearningSection(section))notFound();
  const config=learningSections[section];
  let categories:Awaited<ReturnType<typeof getVideoCategories>>;
  try{categories=await getVideoCategories(config.section)}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again later.</p></section>}
  const folder=categories.find(category=>category.id===id);
  if(!folder)notFound();
  const parent=categories.find(category=>category.id===folder.parentId),children=categories.filter(category=>category.parentId===id);
  const sample=id===config.sampleCategory?lessons.find(lesson=>lesson.slug===config.sample):undefined;
  const speaking=section==="ielts-examples"&&isSpeakingFolder(id,categories);
  let examples=speakingSamples.filter(item=>speaking&&item.category===id).map(item=>({id:item.id,question:item.question})),examplesUnavailable=false;
  if(speaking){try{const records=await getDb().select().from(ieltsSpeakingExamples).where(and(eq(ieltsSpeakingExamples.category,id),eq(ieltsSpeakingExamples.status,"published"))).all();examples=[...examples,...records.map(item=>({id:item.id,question:item.question}))]}catch{examplesUnavailable=true}}
  return <section className="section shell catalog-page">
    <Link className="folder-back" href={parent?`/${section}/categories/${parent.id}`:`/${section}`}><ArrowLeft size={18}/>{parent?parent.name:`All ${config.title} folders`}</Link>
    <span className="section-eyebrow">{config.title.toUpperCase()}</span><h1>{folder.name}</h1>
    {children.length>0&&<div className="video-folder-grid">{children.map(child=><Link className="video-folder-card" href={`/${section}/categories/${child.id}`} key={child.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{child.name}</h2><span className="folder-open">Open folder</span></Link>)}</div>}
    {examplesUnavailable&&<p className="notice">Some published questions are temporarily unavailable. You can still open the sample questions.</p>}
    {examples.length>0&&<div className="speaking-question-list"><h2>Questions and answers</h2><p>Select a question to hear and read its model answer.</p>{examples.map((item,index)=><Link className="speaking-question-row" href={`/ielts-examples/speaking/${item.id}`} key={item.id}><span className="speaking-question-number">{index+1}</span><strong>{item.question}</strong><span aria-hidden="true">›</span></Link>)}</div>}
    {sample?<div className="lesson-grid"><Link className="lesson-card" href={section==="ielts-examples"?"/ielts-examples/sample-reading":`/lessons/${sample.slug}`}><div className="lesson-content"><span className="section-eyebrow">SAMPLE · {sample.level}</span><h2>{section==="ielts-examples"?"Read a Library Notice":sample.title}</h2><p>{section==="ielts-examples"?"Read a short notice and answer two questions with feedback.":sample.description}</p><span className="text-link">Open lesson</span></div></Link></div>:children.length===0&&examples.length===0?<div className="folder-empty"><FolderOpen size={40}/><h2>No lessons in this folder yet</h2><p>The administrator can organize this folder now. New examples will appear here when published.</p></div>:null}
  </section>
}

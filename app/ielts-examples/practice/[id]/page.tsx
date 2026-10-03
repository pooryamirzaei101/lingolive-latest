import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { ieltsSamples, type SpeakingExample } from "@/lib/ielts-speaking";
import { IeltsSpeakingLesson } from "@/components/ielts-speaking-lesson";

export const dynamic="force-dynamic";
export default async function IeltsPracticePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params,sample=ieltsSamples.find(item=>item.id===id);
  let example:SpeakingExample|undefined=sample;
  if(!sample){try{const row=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(row&&(row.status==="published"||await isAdmin()))example={id:row.id,category:row.category,question:row.question,cue:row.cue,answer:row.answer,translation:row.translation,audioKey:row.audioKey,status:row.status as "draft"|"published"}}catch{}}
  if(!example)notFound();
  let skill="IELTS";
  try{const categories=await getVideoCategories("ielts");let folder=categories.find(item=>item.id===example.category);for(let i=0;folder&&i<categories.length;i++){if(!folder.parentId){skill=folder.name;break}folder=categories.find(item=>item.id===folder?.parentId)}}catch{}
  const audioSrc=sample&&sample.category.startsWith("ielts-speaking")?`/ielts-audio/${sample.id}.mp3`:sample?null:example.audioKey?`/api/ielts-speaking/${example.id}/audio`:null;
  return <section className="section shell catalog-page speaking-lesson-page"><Link className="folder-back" href={`/ielts-examples/categories/${example.category}`}>← Back to questions</Link><span className="section-eyebrow">IELTS {skill.toUpperCase()} · {sample?"SAMPLE":example.status==="draft"?"DRAFT PREVIEW":"PRACTICE"}</span><h1>{example.question}</h1><IeltsSpeakingLesson example={example} audioSrc={audioSrc}/></section>
}

import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { ieltsSamples, type SpeakingExample } from "@/lib/ielts-speaking";
import { IeltsSpeakingLesson } from "@/components/ielts-speaking-lesson";
import { isSampleHidden } from "@/lib/sample-visibility";
import {IeltsReadingLesson} from '@/components/ielts-reading-lesson';
import {IeltsTeleprompter} from '@/components/ielts-teleprompter';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import type {ReadingQuestion,CuePoint} from '@/lib/ielts-practice';

export const dynamic="force-dynamic";
export default async function IeltsPracticePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params,sample=ieltsSamples.find(item=>item.id===id);
  if(sample&&await isSampleHidden(id))notFound();
  let example:SpeakingExample|undefined=sample,record:typeof ieltsSpeakingExamples.$inferSelect|undefined;
  if(!sample){try{const row=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(row&&(row.status==="published"||await isAdmin())){record=row;example={id:row.id,category:row.category,question:row.question,cue:row.cue,answer:row.answer,translation:row.translation,vocabulary:row.vocabulary,audioKey:row.audioKey,status:row.status as "draft"|"published"}}}catch{}}
  if(!example)notFound();
  if(!await canLearn('ielts',id))return <MembershipLock/>;
  let skill="IELTS";
  try{const categories=await getVideoCategories("ielts");let folder=categories.find(item=>item.id===example.category);for(let i=0;folder&&i<categories.length;i++){if(!folder.parentId){skill=folder.name;break}folder=categories.find(item=>item.id===folder?.parentId)}}catch{}
  if(record?.kind==='reading')return <section className="section shell catalog-page"><Link className="folder-back" href={`/ielts-examples/categories/${record.category}`}>← Back to Reading</Link><h1>{record.question}</h1><IeltsReadingLesson id={id} title={record.question} passage={record.answer} instructions={record.cue} track={record.track} questions={JSON.parse(record.questions) as ReadingQuestion[]} vocabulary={record.vocabulary}/></section>;
  if(record?.kind==='speaking_video')return <section className="section shell catalog-page"><Link className="folder-back" href={`/ielts-examples/categories/${record.category}`}>← Back to Speaking</Link><span className="section-eyebrow">IELTS SPEAKING · {record.status==='draft'?'DRAFT PREVIEW':'PRACTICE'}</span><h1>{record.question}</h1><IeltsTeleprompter id={id} question={record.question} prompt={record.cue} text={record.answer} vocabulary={record.vocabulary} cues={JSON.parse(record.cuePoints) as CuePoint[]} speed={record.scrollSpeed} videoKey={record.videoKey} videoUrl={record.videoUrl} signedIn={!!await getChatGPTUser()}/></section>;
  const audioSrc=sample&&sample.category.startsWith("ielts-speaking")?`/ielts-audio/${sample.id}.mp3`:sample?null:example.audioKey?`/api/ielts-speaking/${example.id}/audio`:null;
  return <section className="section shell catalog-page speaking-lesson-page"><Link className="folder-back" href={`/ielts-examples/categories/${example.category}`}>← Back to questions</Link><span className="section-eyebrow">IELTS {skill.toUpperCase()} · {sample?"SAMPLE":example.status==="draft"?"DRAFT PREVIEW":"PRACTICE"}</span><h1>{example.question}</h1><IeltsSpeakingLesson example={example} audioSrc={audioSrc}/></section>
}

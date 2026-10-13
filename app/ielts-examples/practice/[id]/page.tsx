import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq,asc } from "drizzle-orm";
import { getDb } from "@/db";
import { ieltsSpeakingExamples,ieltsBlocks } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { ieltsSamples, type SpeakingExample } from "@/lib/ielts-speaking";
import { IeltsSpeakingLesson } from "@/components/ielts-speaking-lesson";
import { isSampleHidden } from "@/lib/sample-visibility";
import {IeltsReadingLesson} from '@/components/ielts-reading-lesson';
import {IeltsReadingBlocks} from '@/components/ielts-reading-blocks';
import {IeltsTeleprompter} from '@/components/ielts-teleprompter';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import type {ReadingQuestion,CuePoint} from '@/lib/ielts-practice';
import {TimedAudioLesson} from '@/components/timed-audio-lesson';
import {ieltsBase,type IeltsMode} from '@/lib/ielts-library';

export const dynamic="force-dynamic";
export default async function IeltsPracticePage({params,mode}:{params:Promise<{id:string}>;mode?:IeltsMode}){
  const {id}=await params,sample=ieltsSamples.find(item=>item.id===id);
  if(sample&&await isSampleHidden(id))notFound();
  let example:SpeakingExample|undefined=sample,record:typeof ieltsSpeakingExamples.$inferSelect|undefined;
  if(!sample){try{const row=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(row&&(row.status==="published"||await isAdmin())){record=row;example={id:row.id,category:row.category,question:row.question,cue:row.cue,answer:row.answer,translation:row.translation,vocabulary:row.vocabulary,audioKey:row.audioKey,status:row.status as "draft"|"published"}}}catch{}}
  if(!example||mode==='video'&&record?.kind!=='speaking_video'||mode==='listening'&&record?.kind==='speaking_video')notFound();
  const back=`${ieltsBase(mode||(record?.kind==='speaking_video'?'video':'listening'))}/folders/${example.category}`;
  if(!await canLearn('ielts',id))return <MembershipLock/>;
  let skill="IELTS";
  try{const categories=await getVideoCategories("ielts");let folder=categories.find(item=>item.id===example.category);for(let i=0;folder&&i<categories.length;i++){if(!folder.parentId){skill=folder.name;break}folder=categories.find(item=>item.id===folder?.parentId)}}catch{}
  const blocks=record?.kind==='reading'?await getDb().select().from(ieltsBlocks).where(eq(ieltsBlocks.lessonId,id)).orderBy(asc(ieltsBlocks.position)).all():[];
  if(record?.kind==='reading')return <section className="section shell catalog-page"><Link className="folder-back" href={back}>← Back to Reading</Link><h1>{record.question}</h1><p>{record.level}{record.band?` · IELTS band ${record.band}`:""}</p>{record.description&&<p>{record.description}</p>}<IeltsReadingLesson id={id} title={record.question} passage={record.answer} instructions={record.cue} track={record.track} questions={JSON.parse(record.questions) as ReadingQuestion[]} vocabulary={record.vocabulary} pdfKey={record.pdfKey} audioKey={record.audioKey}/><IeltsReadingBlocks id={id} blocks={blocks}/></section>;
  if(record?.kind==='speaking_video')return <section className="section shell catalog-page"><Link className="folder-back" href={back}>← Back to Speaking</Link><span className="section-eyebrow">IELTS SPEAKING · {record.status==='draft'?'DRAFT PREVIEW':'PRACTICE'}</span><h1>{record.question}</h1><p>{record.level}{record.band?` · IELTS band ${record.band}`:""}</p>{record.description&&<p>{record.description}</p>}<IeltsTeleprompter id={id} question={record.question} prompt={record.cue} text={record.answer} vocabulary={record.vocabulary} cues={JSON.parse(record.cuePoints) as CuePoint[]} speed={record.scrollSpeed} videoKey={record.videoKey} videoUrl={record.videoUrl} thumbnailKey={record.thumbnailKey} displayFormat={record.displayFormat} signedIn={!!await getChatGPTUser()}/></section>;
  if(record?.kind==='listening')return <section className="section shell catalog-page"><Link className="folder-back" href={back}>← Back to audio lessons</Link><span className="section-eyebrow">IELTS LISTENING & READING · {record.status==='draft'?'DRAFT PREVIEW':'AUDIO LESSON'}</span><h1>{record.question}</h1>{record.description&&<p>{record.description}</p>}{record.audioKey?<TimedAudioLesson section="ielts" id={id} src={`/api/ielts-speaking/${id}/audio`} initialTranslation={false}/>:<p>No audio attached yet.</p>}</section>;
  const audioSrc=sample&&sample.category.startsWith("ielts-speaking")?`/ielts-audio/${sample.id}.mp3`:sample?null:example.audioKey?`/api/ielts-speaking/${example.id}/audio`:null;
  return <section className="section shell catalog-page speaking-lesson-page"><Link className="folder-back" href={back}>← Back to questions</Link><span className="section-eyebrow">IELTS {skill.toUpperCase()} · {sample?"SAMPLE":example.status==="draft"?"DRAFT PREVIEW":"PRACTICE"}</span><h1>{example.question}</h1>{record?.description&&<p>{record.description}</p>}<IeltsSpeakingLesson example={example} audioSrc={audioSrc}/>{record?.pdfKey&&<div className="ielts-pdf detail-panel"><h2>Lesson PDF</h2><iframe title="Lesson PDF" src={`/api/ielts-speaking/${id}/asset/pdf`}/></div>}</section>
}

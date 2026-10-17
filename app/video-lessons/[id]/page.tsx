import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import {preferredLanguage} from "@/lib/translation-service";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedSentences, videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { parseTranscript } from "@/lib/video";
import { getVideoCategories } from "@/lib/video-categories";
import { VideoLearningPlayer } from "@/components/video-learning-player";
import { YouTubeLearningLesson } from "@/components/youtube-learning-lesson";
import { newsExample, speakingVideoExample, videoExample } from "@/lib/video-example";
import { isSampleHidden } from "@/lib/sample-visibility";
export const dynamic="force-dynamic";
export default async function VideoLesson({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{t?:string}>}){
  const {id}=await params,{t}=await searchParams,user=await getChatGPTUser(),startAt=Number(t||0);
  const sample=[videoExample,newsExample,speakingVideoExample].find(item=>item.id===id);
  if(sample&&await isSampleHidden(id))notFound();
  const lesson=sample?null:await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();
  if(!sample&&(!lesson||(lesson.status!=="published"&&!await isAdmin())))notFound();
  if(!await canLearn('video',id))return <MembershipLock/>;
  const language=user?await preferredLanguage(user.userId):"fa";
  const saved=user?await getDb().select({start:savedSentences.start}).from(savedSentences).where(and(eq(savedSentences.userId,user.userId),eq(savedSentences.lessonId,id))).all():[];
  const folders=lesson?await getVideoCategories(lesson.contentKind==="speaking"?"speaking":lesson.contentKind==="youtube"?"youtube":"video"):[];
  const category=sample?.category==="news"?"News":sample?.id===speakingVideoExample.id?"Everyday Conversations":sample?"Daily English":folders.find(c=>c.id===lesson!.category||c.legacy===lesson!.category)?.name||lesson!.category;
  let news=sample?.category==="news"||lesson?.category==="news";let current=folders.find(c=>c.id===lesson?.category);
  for(let i=0;current?.parentId&&i<folders.length;i++){if(current.parentId==="news"){news=true;break}current=folders.find(c=>c.id===current?.parentId)}
  const title=sample?.title||lesson!.title,description=sample?.description||lesson!.description,lines=sample?.lines||parseTranscript(lesson!.transcript),level=sample?.level||lesson!.level;
  const speakingMode=sample?.id===speakingVideoExample.id||lesson?.contentKind==="speaking";
  if(lesson?.contentKind==="youtube"&&lesson.sourceUrl)return <section className="section shell catalog-page"><a className="folder-back" href={`/youtube-videos/categories/${lesson.category}`}>← YouTube Videos</a><span className="section-eyebrow">YOUTUBE VIDEOS · {lesson.status==="draft"?"DRAFT PREVIEW":"LESSON"}</span><h1>{title}</h1><p>{description}</p><YouTubeLearningLesson id={id} url={lesson.sourceUrl} lines={lines} title={title} signedIn={!!user} initiallySaved={saved.map(row=>row.start)} initialLanguage={language} startAt={Number.isFinite(startAt)?startAt:0} thumbnail={lesson.thumbnailKey?`/api/video-lessons/${id}/thumbnail?k=${encodeURIComponent(lesson.thumbnailKey)}`:undefined}/></section>;
  if(speakingMode)return <section className="section shell speaking-watch-page"><VideoLearningPlayer initialLanguage={language} id={id} lines={lines} src={sample?.src} signedIn={!!user} speakingMode canRecord={!!sample||lesson?.status==="published"} vertical={lesson?.displayFormat==="vertical"} thumbnail={lesson?.thumbnailKey?`/api/video-lessons/${id}/thumbnail?k=${encodeURIComponent(lesson.thumbnailKey)}`:undefined}/></section>;
  return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{news?"NEWS":speakingMode?"SPEAKING PRACTICE":"VIDEO LESSONS"} · {category} · {level} {sample?"· SAMPLE":lesson?.status==="draft"?"· DRAFT PREVIEW":""}</span><h1>{title}</h1><p>{description}</p></div></section><section className="section shell video-lesson-section"><VideoLearningPlayer initialLanguage={language} id={id} lines={lines} src={sample?.src} signedIn={!!user} initiallySaved={saved.map(row=>row.start)} startAt={Number.isFinite(startAt)&&startAt>=0?startAt:0} speakingMode={speakingMode} canRecord={speakingMode&&(!!sample||lesson?.status==="published")} vertical={lesson?.displayFormat==="vertical"} thumbnail={lesson?.thumbnailKey?`/api/video-lessons/${id}/thumbnail?k=${encodeURIComponent(lesson.thumbnailKey)}`:undefined}/></section></>
}

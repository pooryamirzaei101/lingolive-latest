import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedSentences, videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { parseTranscript } from "@/lib/video";
import { getVideoCategories } from "@/lib/video-categories";
import { VideoLearningPlayer } from "@/components/video-learning-player";
import { newsExample, speakingVideoExample, videoExample } from "@/lib/video-example";
export const dynamic="force-dynamic";
export default async function VideoLesson({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{t?:string}>}){
  const {id}=await params,{t}=await searchParams,user=await getChatGPTUser(),startAt=Number(t||0);
  const sample=[videoExample,newsExample,speakingVideoExample].find(item=>item.id===id);
  const lesson=sample?null:await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();
  if(!sample&&(!lesson||(lesson.status!=="published"&&!await isAdmin())))notFound();
  const saved=user?await getDb().select({start:savedSentences.start}).from(savedSentences).where(and(eq(savedSentences.userId,user.userId),eq(savedSentences.lessonId,id))).all():[];
  const category=sample?.category==="news"?"News":sample?.id===speakingVideoExample.id?"Everyday Conversations":sample?"Daily English":(await getVideoCategories(lesson!.contentKind==="speaking"?"speaking":"video")).find(c=>c.id===lesson!.category||c.legacy===lesson!.category)?.name||lesson!.category;
  const title=sample?.title||lesson!.title,description=sample?.description||lesson!.description,lines=sample?.lines||parseTranscript(lesson!.transcript),level=sample?.level||lesson!.level;
  const speakingMode=sample?.id===speakingVideoExample.id||lesson?.contentKind==="speaking";
  return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{sample?.category==="news"?"NEWS":speakingMode?"SPEAKING PRACTICE":"VIDEO LESSONS"} · {category} · {level} {sample?"· SAMPLE":lesson?.status==="draft"?"· DRAFT PREVIEW":""}</span><h1>{title}</h1><p>{description}</p></div></section><section className="section shell video-lesson-section"><VideoLearningPlayer id={id} lines={lines} src={sample?.src} signedIn={!!user} initiallySaved={saved.map(row=>row.start)} startAt={Number.isFinite(startAt)&&startAt>=0?startAt:0} speakingMode={speakingMode} canRecord={speakingMode&&(!!sample||lesson?.status==="published")}/></section></>
}

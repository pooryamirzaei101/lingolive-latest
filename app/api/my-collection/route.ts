import {canLearn} from '@/lib/membership';
import {isTranslationLanguage} from "@/lib/languages";
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedSentences, videoLessons } from "@/db/schema";
import { newsExample, speakingVideoExample, videoExample } from "@/lib/video-example";
import { parseTranscript } from "@/lib/video";

export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to save sentences."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  try{
    const body=await request.json() as {lessonId?:string;start?:number;language?:string},lessonId=body.lessonId||"",start=body.start;
    if(!lessonId||typeof start!=="number"||!Number.isFinite(start)||start<0)return Response.json({error:"Choose a sentence to save."},{status:400});
    const sample=[videoExample,newsExample,speakingVideoExample].find(item=>item.id===lessonId);
    const lesson=sample?null:await getDb().select().from(videoLessons).where(eq(videoLessons.id,lessonId)).get();
    if(!sample&&(!lesson||lesson.status!=="published"))return Response.json({error:"This lesson is unavailable."},{status:404});
    if(!await canLearn('video',lessonId))return Response.json({error:'Membership required.'},{status:403});
    const lines=sample?sample.lines:parseTranscript(lesson!.transcript),line=lines.find(item=>Math.round(item.start*1000)===start);
    if(!line)return Response.json({error:"This sentence is no longer available."},{status:404});
    const db=getDb(),existing=await db.select({id:savedSentences.id}).from(savedSentences).where(and(eq(savedSentences.userId,user.userId),eq(savedSentences.lessonId,lessonId),eq(savedSentences.start,start))).get();
    if(existing)return Response.json({saved:true,id:existing.id});
    const id=crypto.randomUUID();await db.insert(savedSentences).values({id,userId:user.userId,lessonId,lessonTitle:sample?.title||lesson!.title,section:lesson?.contentKind==="youtube"?"YouTube Videos":sample?.category==="news"?"News":sample?.id===speakingVideoExample.id||lesson?.contentKind==="speaking"?"Speaking Practice":"Video Lessons",start,english:line.english,translation:(line.translations as Record<string,string>)[isTranslationLanguage(body.language)?body.language:"fa"]||"",createdAt:Date.now()}).onConflictDoNothing();
    return Response.json({saved:true,id});
  }catch{return Response.json({error:"Could not save this sentence. Please try again."},{status:500})}
}

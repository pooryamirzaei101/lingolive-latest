import {canLearn} from '@/lib/membership';
import { and, desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb, getMediaBucket } from "@/db";
import { speakingRecordings, videoLessons,ieltsSpeakingExamples } from "@/db/schema";
import { speakingVideoExample } from "@/lib/video-example";

export async function GET(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to view recordings."},{status:401});
  const lessonId=new URL(request.url).searchParams.get("lessonId")||"";if(!lessonId)return Response.json({error:"Missing lesson"},{status:400});
  try{const rows=await getDb().select({id:speakingRecordings.id,mimeType:speakingRecordings.mimeType,title:speakingRecordings.title,duration:speakingRecordings.duration,createdAt:speakingRecordings.createdAt}).from(speakingRecordings).where(and(eq(speakingRecordings.userId,user.userId),eq(speakingRecordings.lessonId,lessonId))).orderBy(desc(speakingRecordings.createdAt)).limit(30).all();return Response.json({recordings:rows})}catch{return Response.json({error:"Recordings are temporarily unavailable."},{status:500})}
}
export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to save a recording."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  try{const form=await request.formData(),lessonId=String(form.get("lessonId")||""),file=form.get("audio"),duration=Number(form.get("duration")||0);
    const lesson=lessonId===speakingVideoExample.id?null:await getDb().select().from(videoLessons).where(eq(videoLessons.id,lessonId)).get(),ielts=lesson?null:await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,lessonId)).get();
    if(lessonId!==speakingVideoExample.id&&(!lesson||lesson.status!=="published"||lesson.contentKind!=="speaking")&&(!ielts||ielts.status!=='published'||ielts.kind!=='speaking_video'))return Response.json({error:"Speaking lesson not found."},{status:404});
    if(!await canLearn(ielts?'ielts':'video',lessonId))return Response.json({error:'Membership required.'},{status:403});
    if(!(file instanceof File)||!(["audio/webm","audio/mp4","audio/ogg","video/webm","video/mp4"] as string[]).includes(file.type)||file.size===0||file.size>25*1024*1024)return Response.json({error:"Record up to two minutes, under 25 MB."},{status:400});
    if(!Number.isFinite(duration)||duration<0||duration>120)return Response.json({error:"Invalid recording duration."},{status:400});
    const id=crypto.randomUUID(),key=`speaking-recordings/${user.userId}/${id}`;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().insert(speakingRecordings).values({id,userId:user.userId,lessonId,title:"",duration:Math.round(duration),mediaKey:key,mimeType:file.type,createdAt:Date.now()})}catch(error){await getMediaBucket().delete(key);throw error}
    return Response.json({id,mimeType:file.type,createdAt:Date.now()},{status:201});
  }catch{return Response.json({error:"Your recording could not be saved. Please try again."},{status:500})}
}

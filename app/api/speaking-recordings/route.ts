import { and, desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb, getMediaBucket } from "@/db";
import { speakingRecordings, videoLessons } from "@/db/schema";
import { speakingVideoExample } from "@/lib/video-example";

export async function GET(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to view recordings."},{status:401});
  const lessonId=new URL(request.url).searchParams.get("lessonId")||"";if(!lessonId)return Response.json({error:"Missing lesson"},{status:400});
  try{const rows=await getDb().select({id:speakingRecordings.id,createdAt:speakingRecordings.createdAt}).from(speakingRecordings).where(and(eq(speakingRecordings.userId,user.userId),eq(speakingRecordings.lessonId,lessonId))).orderBy(desc(speakingRecordings.createdAt)).limit(30).all();return Response.json({recordings:rows})}catch{return Response.json({error:"Recordings are temporarily unavailable."},{status:500})}
}
export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to save a recording."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  try{const form=await request.formData(),lessonId=String(form.get("lessonId")||""),file=form.get("audio");
    const lesson=lessonId===speakingVideoExample.id?null:await getDb().select().from(videoLessons).where(eq(videoLessons.id,lessonId)).get();
    if(lessonId!==speakingVideoExample.id&&(!lesson||lesson.status!=="published"||lesson.contentKind!=="speaking"))return Response.json({error:"Speaking lesson not found."},{status:404});
    if(!(file instanceof File)||!(["audio/webm","audio/mp4","audio/ogg"] as string[]).includes(file.type)||file.size===0||file.size>10*1024*1024)return Response.json({error:"Record up to two minutes of audio, under 10 MB."},{status:400});
    const id=crypto.randomUUID(),key=`speaking-recordings/${user.userId}/${id}`;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().insert(speakingRecordings).values({id,userId:user.userId,lessonId,mediaKey:key,mimeType:file.type,createdAt:Date.now()})}catch(error){await getMediaBucket().delete(key);throw error}
    return Response.json({id,createdAt:Date.now()},{status:201});
  }catch{return Response.json({error:"Your recording could not be saved. Please try again."},{status:500})}
}

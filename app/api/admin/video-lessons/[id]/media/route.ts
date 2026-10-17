import {audioTypes,videoTypes} from "@/lib/podcast-media";
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons,transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { stagedMedia } from "@/lib/admin-media";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson||lesson.contentKind==="youtube")return Response.json({error:"Uploaded video not found"},{status:404});
    const form=await request.formData(),file=form.get(lesson.contentKind==="podcast"?"podcastMedia":"video"),kind=lesson.contentKind==="podcast"&&String(form.get("mediaKind"))==="audio"?"audio":"video",uploaded=await stagedMedia(String(form.get("uploadKey")||""),kind);if(!uploaded&&(!(file instanceof File)||!file.size||file.size>90*1024*1024||!(lesson.contentKind==="podcast"?[...audioTypes,...videoTypes]: [...videoTypes] as string[]).includes(file.type)))return Response.json({error:"Choose an MP4 or WebM video up to 100 MB."},{status:400});
    const key=uploaded?.key||`video-lessons/${id}/${crypto.randomUUID()}`;if(!uploaded&&file instanceof File)await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().update(videoLessons).set({mediaKey:key,mimeType:uploaded?.mimeType||(file as File).type,status:"draft",...(lesson.contentKind==="podcast"?{transcript:"[]"}:{})}).where(eq(videoLessons.id,id));if(lesson.contentKind==="podcast")await getDb().delete(transcriptJobs).where(eq(transcriptJobs.lessonId,id))}catch(error){await getMediaBucket().delete(key);throw error}
    if(lesson.mediaKey)await getMediaBucket().delete(lesson.mediaKey).catch(()=>{});
    return Response.json({saved:true,status:"draft"});
  }catch{return Response.json({error:"Could not replace the video."},{status:500})}
}

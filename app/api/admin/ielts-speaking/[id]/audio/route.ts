import {audioTypes,audioUploadMime} from "@/lib/podcast-media";
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples,mediaTranscripts,transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { stagedMedia } from "@/lib/admin-media";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const current=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!current)return Response.json({error:"Example not found"},{status:404});
    const form=await request.formData(),file=form.get("audio"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),"audio");
    if(!uploaded&&(!(file instanceof File)||!file.size||file.size>100_000_000||!(audioTypes as readonly string[]).includes(audioUploadMime(file))))return Response.json({error:"Choose an audio file up to 100 MB."},{status:400});
    const key=uploaded?.key||`ielts-speaking/${id}/model-audio`;if(!uploaded&&file instanceof File)await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:audioUploadMime(file)}});
    try{await getDb().update(ieltsSpeakingExamples).set({audioKey:key,mimeType:uploaded?.mimeType||(file instanceof File?audioUploadMime(file):null),status:"draft"}).where(eq(ieltsSpeakingExamples.id,id));await getDb().delete(mediaTranscripts).where(eq(mediaTranscripts.id,`ielts:${id}`));await getDb().delete(transcriptJobs).where(eq(transcriptJobs.lessonId,`ielts:${id}`))}catch(error){if(uploaded)await getMediaBucket().delete(key);throw error}
    if(current.audioKey&&current.audioKey!==key)await getMediaBucket().delete(current.audioKey).catch(()=>{});return Response.json({saved:true});
  }catch{return Response.json({error:"Could not save audio."},{status:500})}
}

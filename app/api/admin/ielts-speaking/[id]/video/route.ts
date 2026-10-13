import {eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {ieltsSpeakingExamples,mediaTranscripts,transcriptJobs} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {stagedMedia} from '@/lib/admin-media';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id}=await params,db=getDb(),current=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();
 if(!current||current.kind!=='speaking_video')return Response.json({error:'Speaking video not found.'},{status:404});
 try{const form=await request.formData(),uploaded=await stagedMedia(String(form.get('uploadKey')||''),'video');if(!uploaded||!['video/mp4','video/webm','video/quicktime'].includes(uploaded.mimeType))return Response.json({error:'Upload an MP4, WebM, or MOV video up to 100 MB.'},{status:400});
  await db.update(ieltsSpeakingExamples).set({videoKey:uploaded.key,videoMimeType:uploaded.mimeType,videoUrl:null,status:'draft',answer:''}).where(eq(ieltsSpeakingExamples.id,id));
  await db.delete(mediaTranscripts).where(eq(mediaTranscripts.id,`ielts:${id}`));await db.delete(transcriptJobs).where(eq(transcriptJobs.lessonId,`ielts:${id}`));
  if(current.videoKey&&current.videoKey!==uploaded.key)await getMediaBucket().delete(current.videoKey).catch(()=>{});
  return Response.json({saved:true,status:'draft'});
 }catch{return Response.json({error:'Could not save the video.'},{status:500})}
}

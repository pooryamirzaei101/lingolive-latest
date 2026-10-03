import {importYoutubeEnglish} from "@/lib/youtube-captions";
import {lessonMedia,saveMediaTranscript} from "@/lib/lesson-media";
import {cachedTranslation} from "@/lib/translation-cache";
import { eq, and } from "drizzle-orm";
import { getDb,getMediaBucket } from "@/db";
import { videoLessons,transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { integrationConfig,assemblyRequest,googleTranslate } from "@/lib/media-integrations";
import { isTranslationLanguage } from "@/lib/languages";
import { validateSegments } from "@/lib/transcript-import";
import type { TranscriptSegment } from "@/lib/video";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;return Response.json({job:await getDb().select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,new URL(_request.url).searchParams.get("section")&&new URL(_request.url).searchParams.get("section")!=="video"?`${new URL(_request.url).searchParams.get("section")}:${id}`:id)).get()||null})}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
 if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid origin"},{status:403});
 const {id}=await params,db=getDb(),section=new URL(request.url).searchParams.get("section")||"video",jobId=section==="video"?id:`${section}:${id}`;let job=await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get();
 try{const data=await request.json() as any,lesson=await lessonMedia(section,id,true);
 if(data.action==="apply"){
 if(job?.state!=="review")throw new Error("Generate a transcript first.");
 const segments=validateSegments(JSON.parse(job.segments));await saveMediaTranscript(section,id,JSON.stringify(segments));await db.update(transcriptJobs).set({state:"applied"}).where(eq(transcriptJobs.lessonId,jobId));return Response.json({applied:true});
 }
 if(data.action==="captions"){
 if(section!=="video")throw Error("Choose a YouTube lesson.");const video=await db.select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(video?.contentKind!=="youtube"||!video.sourceUrl)throw Error("Choose a YouTube lesson.");if(job&&['uploading','transcribing','translating'].includes(job.state))throw Error("Wait for the current job to finish.");
 const rows=await importYoutubeEnglish(video.sourceUrl);await db.insert(transcriptJobs).values({lessonId:jobId,state:"review",segments:JSON.stringify(rows),languages:"[]",createdAt:Date.now()}).onConflictDoUpdate({target:transcriptJobs.lessonId,set:{state:"review",segments:JSON.stringify(rows),languages:"[]",error:"",cursor:0,createdAt:Date.now()}});return Response.json({job:await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get()});
 }
 const config=await integrationConfig();if(!config.enabled)throw new Error("Connect and enable the transcription or translation API in API Connections first.");
 if(data.action==="translate"){
 if(!config.googleKey)throw Error("Connect the translation API first.");if(job&&['uploading','transcribing','translating'].includes(job.state))throw Error("Wait for the current job to finish.");const rows=validateSegments(JSON.parse(lesson.transcript));if(!rows.length)throw Error("Save the English transcript first.");const languages=Array.isArray(data.languages)?[...new Set(data.languages.filter(isTranslationLanguage))]:[];if(!languages.length)throw Error("Choose a translation language.");
 await db.insert(transcriptJobs).values({lessonId:jobId,state:"translating",segments:JSON.stringify(rows),languages:JSON.stringify(languages),createdAt:Date.now()}).onConflictDoUpdate({target:transcriptJobs.lessonId,set:{state:"translating",segments:JSON.stringify(rows),languages:JSON.stringify(languages),cursor:0,error:"",createdAt:Date.now()}});return Response.json({job:await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get()});
 }
 if(data.action==="start"){
 if(!config.assemblyKey)throw Error("Connect the AssemblyAI transcription API first.");
 if(lesson.contentKind==="youtube"&&!lesson.mediaKey)throw new Error("Import authorized YouTube captions or upload your original media for transcription first.");
 if(job&&!(job.state==="uploading"&&Date.now()-job.createdAt>300000)&&!['failed','applied','review'].includes(job.state))return Response.json({job});
 const langs=Array.isArray(data.languages)?data.languages.filter(isTranslationLanguage):["fa"];if(langs.length>20)throw new Error("Choose supported translation languages.");
 if(langs.length&&!config.googleKey)throw Error("Connect the translation API or generate English only.");
 if(job)await db.delete(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId));
 const inserted=await db.insert(transcriptJobs).values({lessonId:jobId,state:"uploading",languages:JSON.stringify([...new Set(langs)]),createdAt:Date.now()}).onConflictDoNothing().returning();if(!inserted.length)throw new Error("A processing job is already running.");
 const file=await getMediaBucket().get(lesson.mediaKey);if(!file)throw new Error("Video file is unavailable.");
 const upload=await assemblyRequest("upload",config.assemblyKey,{method:"POST",headers:{"Content-Type":"application/octet-stream"},body:file.body});
 const transcript=await assemblyRequest("transcript",config.assemblyKey,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({audio_url:upload.upload_url,language_code:"en",speech_models:["universal-3-pro","universal-2"]})});
 await db.update(transcriptJobs).set({providerId:transcript.id,state:"transcribing"}).where(eq(transcriptJobs.lessonId,jobId));
 }else if(data.action==="poll"&&job){
 if(job.state==="transcribing"){
 const result=await assemblyRequest(`transcript/${job.providerId}`,config.assemblyKey);
 if(result.status==="error")throw new Error("Transcription failed. Check that the video includes audible English speech.");
 if(result.status==="completed"){
 const result=await assemblyRequest(`transcript/${job.providerId}/sentences`,config.assemblyKey);
 const rows=validateSegments((result.sentences||[]).map((s:any)=>({start:s.start/1000,end:s.end/1000,english:s.text,translations:{}})));if(!rows.length)throw new Error("No English speech was detected.");
 await db.update(transcriptJobs).set({state:JSON.parse(job.languages).length?"translating":"review",segments:JSON.stringify(rows),cursor:0}).where(eq(transcriptJobs.lessonId,jobId));
 }
 }else if(job.state==="translating"){
 const rows=JSON.parse(job.segments) as TranscriptSegment[],languages=JSON.parse(job.languages) as string[];const total=rows.length*languages.length,lang=languages[Math.floor(job.cursor/rows.length)],start=job.cursor%rows.length,end=Math.min(start+20,rows.length);
 const translated=await Promise.all(rows.slice(start,end).map(async s=>s.translations[lang]||(await cachedTranslation(s.english,lang as import("@/lib/languages").TranslationLanguage)).translation));for(let i=start;i<end;i++)rows[i].translations[lang]=translated[i-start];const cursor=job.cursor+end-start;
 await db.update(transcriptJobs).set({segments:JSON.stringify(rows),cursor,state:cursor>=total?"review":"translating"}).where(and(eq(transcriptJobs.lessonId,jobId),eq(transcriptJobs.cursor,job.cursor)));
 }
 }
 return Response.json({job:await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get()});
 }catch(e){const error=e instanceof Error?e.message:"Processing failed.";if(job||await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get())await db.update(transcriptJobs).set({state:"failed",error}).where(eq(transcriptJobs.lessonId,jobId));return Response.json({error},{status:400})}
}

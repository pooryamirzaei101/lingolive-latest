import {hasPlaceholderTiming} from "@/lib/plain-script";
import {validVideoFormat} from "@/lib/thumbnails";
import {validateSegments} from "@/lib/transcript-import";
import { eq,and } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons,transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { parseTranscript } from "@/lib/video";
import { getVideoCategories } from "@/lib/video-categories";
import { youtubeEmbedUrl } from "@/lib/youtube";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{
    const data=await request.json() as {transcript?:string;status?:string;category?:string;contentKind?:string;title?:string;description?:string;level?:string;displayFormat?:string;sourceUrl?:string};
    const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson)return Response.json({error:"Lesson not found"},{status:404});
    if(typeof data.title==="string"){
      const title=data.title.trim(),description=String(data.description??lesson.description).trim(),level=data.level??lesson.level,displayFormat=data.displayFormat??lesson.displayFormat;
      if(!title||title.length>160||description.length>4000||!["Beginner","Intermediate","Advanced"].includes(level)||!validVideoFormat(displayFormat))return Response.json({error:"Check the title, description, level, and video format."},{status:400});
      let sourceUrl=lesson.sourceUrl;
      if(lesson.contentKind==="youtube"){sourceUrl=youtubeEmbedUrl(String(data.sourceUrl||""));if(!sourceUrl)return Response.json({error:"Enter a valid YouTube video or Shorts URL."},{status:400})}
      await getDb().update(videoLessons).set({title,description,level,displayFormat,sourceUrl}).where(eq(videoLessons.id,id));
    }else if(typeof data.transcript==="string"){
      const lines=validateSegments(JSON.parse(data.transcript));
      await getDb().update(videoLessons).set({transcript:JSON.stringify(lines),status:"draft"}).where(eq(videoLessons.id,id));
      if(lesson.contentKind==="podcast"){
        const existing=await getDb().select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,id)).get();
        if(!existing||!["uploading","transcribing","translating","review"].includes(existing.state))await getDb().insert(transcriptJobs).values({lessonId:id,state:"approved",segments:JSON.stringify(lines),createdAt:Date.now()}).onConflictDoUpdate({target:transcriptJobs.lessonId,set:{state:"approved",segments:JSON.stringify(lines),error:""}});
      }else await getDb().update(transcriptJobs).set({state:"approved"}).where(and(eq(transcriptJobs.lessonId,id),eq(transcriptJobs.state,"needs_review")));
    }else if(typeof data.category==="string"){
      const kind=data.contentKind||lesson.contentKind;if(kind!=="video"&&kind!=="speaking"&&kind!=="youtube"&&kind!=="podcast")return Response.json({error:"Choose a valid section."},{status:400});
      if(kind!==lesson.contentKind)return Response.json({error:"Move lessons between folders in the same section."},{status:400});
      if(!(await getVideoCategories(kind)).some(c=>c.id===data.category))return Response.json({error:"Choose an existing category."},{status:400});
      await getDb().update(videoLessons).set({category:data.category,contentKind:kind}).where(eq(videoLessons.id,id));
    }else if(data.status==="published"||data.status==="draft"){
      if(data.status==="published"&&lesson.contentKind==="podcast"&&hasPlaceholderTiming(parseTranscript(lesson.transcript)))return Response.json({error:"This pasted script has temporary timings. Synchronize it with the podcast audio or import a timed English SRT before publishing."},{status:400});
      if(data.status==="published"&&lesson.contentKind!=="speaking"&&parseTranscript(lesson.transcript).length===0)return Response.json({error:"Review and save a transcript before publishing."},{status:400});
      if(data.status==="published"){
        const job=await getDb().select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,id)).get();
        if(lesson.contentKind==="podcast"&&job?.state!=="approved")return Response.json({error:"Review the timestamped transcript and press Save transcript before publishing."},{status:400});
        if(job&&["uploading","transcribing","translating","review","needs_review"].includes(job.state))return Response.json({error:"Review and apply the generated English transcript or translations, then save your edits before publishing."},{status:400});
      }
      await getDb().update(videoLessons).set({status:data.status}).where(eq(videoLessons.id,id));
    }else return Response.json({error:"Invalid change"},{status:400});
    return Response.json({ok:true});
  }catch(e){return Response.json({error:e instanceof Error?e.message:"Could not save the lesson."},{status:400})}
}

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  if(_request.headers.get("origin")&&_request.headers.get("origin")!==new URL(_request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  const {id}=await params;
  try{const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson)return Response.json({error:"Lesson not found"},{status:404});
    await getDb().delete(videoLessons).where(eq(videoLessons.id,id));if(lesson.mediaKey)await getMediaBucket().delete(lesson.mediaKey);if(lesson.transcriptionKey)await getMediaBucket().delete(lesson.transcriptionKey);if(lesson.thumbnailKey)await getMediaBucket().delete(lesson.thumbnailKey);return Response.json({ok:true});
  }catch{return Response.json({error:"Could not delete the lesson."},{status:500})}
}

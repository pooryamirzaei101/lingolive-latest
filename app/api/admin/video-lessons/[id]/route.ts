import { and, eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { parseTranscript } from "@/lib/video";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{
    const data=await request.json() as {transcript?:string;status?:string};
    const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson)return Response.json({error:"Lesson not found"},{status:404});
    if(typeof data.transcript==="string"){
      const lines=parseTranscript(data.transcript);if(lines.length===0&&data.transcript.trim()!=="[]")return Response.json({error:"Use a JSON array of timestamped transcript lines."},{status:400});
      await getDb().update(videoLessons).set({transcript:JSON.stringify(lines),status:"draft"}).where(eq(videoLessons.id,id));
    }else if(data.status==="published"||data.status==="draft"){
      if(data.status==="published"&&parseTranscript(lesson.transcript).length===0)return Response.json({error:"Review and save a transcript before publishing."},{status:400});
      await getDb().update(videoLessons).set({status:data.status}).where(eq(videoLessons.id,id));
    }else return Response.json({error:"Invalid change"},{status:400});
    return Response.json({ok:true});
  }catch{return Response.json({error:"Could not save the lesson."},{status:500})}
}

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson)return Response.json({error:"Lesson not found"},{status:404});
    await getDb().delete(videoLessons).where(eq(videoLessons.id,id));await getMediaBucket().delete(lesson.mediaKey);return Response.json({ok:true});
  }catch{return Response.json({error:"Could not delete the lesson."},{status:500})}
}

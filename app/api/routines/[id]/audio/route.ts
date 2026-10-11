import {mediaResponse} from '@/lib/media-response';
import {canLearn} from '@/lib/membership';
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb, getMediaBucket } from "@/db";
import { savedRoutines } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getRoutine } from "@/lib/routines";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params,admin=await isAdmin(),lesson=await getRoutine(id,admin);if(!lesson?.audioKey)return new Response("Not found",{status:404});
  if(lesson.status!=="published"&&!admin){
    const user=await getChatGPTUser();if(!user||!await getDb().select({id:savedRoutines.id}).from(savedRoutines).where(and(eq(savedRoutines.userId,user.userId),eq(savedRoutines.lessonId,id))).get())return new Response("Not found",{status:404});
  }
  if(!await canLearn('routine',id))return new Response('Membership required',{status:403});
  return mediaResponse(getMediaBucket(),lesson.audioKey,lesson.mimeType||'audio/mpeg',request);
}
export const HEAD=GET;

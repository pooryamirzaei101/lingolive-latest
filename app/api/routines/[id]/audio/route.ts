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
  const range=request.headers.get("range"),object=await getMediaBucket().get(lesson.audioKey,range?{range:request.headers}:undefined);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers({"Content-Type":lesson.mimeType||"audio/mpeg","Accept-Ranges":"bytes","Cache-Control":"private, no-store"});
  if(range&&object.range){const offset="suffix" in object.range?Math.max(0,object.size-object.range.suffix):(object.range.offset??0),length="suffix" in object.range?Math.min(object.size,object.range.suffix):(object.range.length??object.size-offset);headers.set("Content-Range",`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set("Content-Length",String(length));return new Response(object.body,{status:206,headers})}
  headers.set("Content-Length",String(object.size));return new Response(object.body,{headers});
}

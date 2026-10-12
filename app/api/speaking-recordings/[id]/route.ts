import {mediaResponse} from '@/lib/media-response';
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb, getMediaBucket } from "@/db";
import { speakingRecordings } from "@/db/schema";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getChatGPTUser();if(!user)return new Response("Sign in required",{status:401});const {id}=await params;
  const row=await getDb().select().from(speakingRecordings).where(and(eq(speakingRecordings.id,id),eq(speakingRecordings.userId,user.userId))).get();if(!row)return new Response("Not found",{status:404});
  return mediaResponse(getMediaBucket(),row.mediaKey,row.mimeType,request);
}
export const HEAD=GET;
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required'},{status:401});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin'},{status:403});
 const {id}=await params,body=await request.json() as {title?:string},title=body.title?.trim()||'';
 if(!title||title.length>100)return Response.json({error:'Enter a title up to 100 characters.'},{status:400});
 const result=await getDb().update(speakingRecordings).set({title}).where(and(eq(speakingRecordings.id,id),eq(speakingRecordings.userId,user.userId))).returning({id:speakingRecordings.id});
 return result.length?Response.json({id,title}):Response.json({error:'Recording not found'},{status:404});
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in required"},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  const {id}=await params;try{const row=await getDb().select().from(speakingRecordings).where(and(eq(speakingRecordings.id,id),eq(speakingRecordings.userId,user.userId))).get();if(!row)return Response.json({error:"Not found"},{status:404});await getMediaBucket().delete(row.mediaKey);await getDb().delete(speakingRecordings).where(eq(speakingRecordings.id,id));return Response.json({ok:true})}catch{return Response.json({error:"Could not delete the recording."},{status:500})}
}

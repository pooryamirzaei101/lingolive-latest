import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb, getMediaBucket } from "@/db";
import { speakingRecordings } from "@/db/schema";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getChatGPTUser();if(!user)return new Response("Sign in required",{status:401});const {id}=await params;
  const row=await getDb().select().from(speakingRecordings).where(and(eq(speakingRecordings.id,id),eq(speakingRecordings.userId,user.userId))).get();if(!row)return new Response("Not found",{status:404});
  const range=request.headers.get("range"),object=await getMediaBucket().get(row.mediaKey,range?{range:request.headers}:undefined);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers({"Content-Type":row.mimeType,"Accept-Ranges":"bytes","Cache-Control":"private, no-store"});
  if(range&&object.range){const offset="suffix" in object.range?Math.max(0,object.size-object.range.suffix):(object.range.offset??0),length="suffix" in object.range?Math.min(object.size,object.range.suffix):(object.range.length??object.size-offset);headers.set("Content-Range",`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set("Content-Length",String(length));return new Response(object.body,{status:206,headers})}
  headers.set("Content-Length",String(object.size));return new Response(object.body,{headers});
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in required"},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  const {id}=await params;try{const row=await getDb().select().from(speakingRecordings).where(and(eq(speakingRecordings.id,id),eq(speakingRecordings.userId,user.userId))).get();if(!row)return Response.json({error:"Not found"},{status:404});await getMediaBucket().delete(row.mediaKey);await getDb().delete(speakingRecordings).where(eq(speakingRecordings.id,id));return Response.json({ok:true})}catch{return Response.json({error:"Could not delete the recording."},{status:500})}
}

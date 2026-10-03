import {canLearn} from '@/lib/membership';
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  try{const tip=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!tip||!tip.audioKey||(tip.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});if(!await canLearn('tips',id))return new Response('Membership required',{status:403});const range=request.headers.get("range"),object=await getMediaBucket().get(tip.audioKey,range?{range:request.headers}:undefined);if(!object)return new Response("Audio unavailable",{status:404});const headers=new Headers({"Content-Type":tip.mimeType||"audio/mpeg","Cache-Control":"private, max-age=60","Accept-Ranges":"bytes"});if(range&&object.range){const offset="suffix" in object.range?Math.max(0,object.size-object.range.suffix):(object.range.offset??0),length="suffix" in object.range?Math.min(object.size,object.range.suffix):(object.range.length??object.size-offset);headers.set("Content-Range",`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set("Content-Length",String(length));return new Response(object.body,{status:206,headers})}headers.set("Content-Length",String(object.size));return new Response(object.body,{headers})}catch{return new Response("Audio unavailable",{status:503})}
}

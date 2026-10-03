import {canLearn} from '@/lib/membership';
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item?.documentKey||(item.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});if(!await canLearn('reading',id))return new Response('Membership required',{status:403});const range=request.headers.get("range"),object=await getMediaBucket().get(item.documentKey,range?{range:request.headers}:undefined);if(!object)return new Response("Not found",{status:404});const headers=new Headers({"Content-Type":"application/pdf","Content-Disposition":"inline","X-Content-Type-Options":"nosniff","Cache-Control":"private, max-age=60","Accept-Ranges":"bytes"});if(range&&object.range){const offset="suffix" in object.range?Math.max(0,object.size-object.range.suffix):(object.range.offset??0),length="suffix" in object.range?Math.min(object.size,object.range.suffix):(object.range.length??object.size-offset);headers.set("Content-Range",`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set("Content-Length",String(length));return new Response(object.body,{status:206,headers})}headers.set("Content-Length",String(object.size));return new Response(object.body,{headers})}catch{return new Response("Document unavailable",{status:503})}
}

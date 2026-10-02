import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();
  if(!lesson||(lesson.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});
  const range=request.headers.get("range");const object=await getMediaBucket().get(lesson.mediaKey,range?{range:request.headers}:undefined);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers({"Content-Type":lesson.mimeType,"Accept-Ranges":"bytes","Cache-Control":"private, max-age=60"});
  if(range&&object.range){const offset="suffix" in object.range?Math.max(0,object.size-object.range.suffix):(object.range.offset??0),length="suffix" in object.range?Math.min(object.size,object.range.suffix):(object.range.length??object.size-offset);headers.set("Content-Range",`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set("Content-Length",String(length));return new Response(object.body,{status:206,headers})}
  headers.set("Content-Length",String(object.size));return new Response(object.body,{headers});
}

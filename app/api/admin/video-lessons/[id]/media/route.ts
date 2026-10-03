import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson||lesson.contentKind==="youtube")return Response.json({error:"Uploaded video not found"},{status:404});
    const form=await request.formData(),file=form.get("video");if(!(file instanceof File)||!file.size||file.size>90*1024*1024||!["video/mp4","video/webm"].includes(file.type))return Response.json({error:"Choose an MP4 or WebM video under 90 MB."},{status:400});
    const key=`video-lessons/${id}/${crypto.randomUUID()}`;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().update(videoLessons).set({mediaKey:key,mimeType:file.type,status:"draft"}).where(eq(videoLessons.id,id))}catch(error){await getMediaBucket().delete(key);throw error}
    if(lesson.mediaKey)await getMediaBucket().delete(lesson.mediaKey).catch(()=>{});
    return Response.json({saved:true,status:"draft"});
  }catch{return Response.json({error:"Could not replace the video."},{status:500})}
}

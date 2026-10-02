import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { VIDEO_CATEGORIES } from "@/lib/video";

export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData();
    const title=String(form.get("title")||"").trim().slice(0,160),description=String(form.get("description")||"").trim().slice(0,1200),category=String(form.get("category")||""),level=String(form.get("level")||"Beginner"),file=form.get("video");
    if(!title||!VIDEO_CATEGORIES.includes(category as typeof VIDEO_CATEGORIES[number])||!(file instanceof File)||!(["video/mp4","video/webm"] as string[]).includes(file.type)||file.size>25*1024*1024||file.size===0)return Response.json({error:"Add a title, category, and MP4 or WebM video under 25 MB."},{status:400});
    const id=crypto.randomUUID(),key=`video-lessons/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,80)}`;
    await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().insert(videoLessons).values({id,title,description,category,level,mediaKey:key,mimeType:file.type,createdAt:Date.now()})}catch(error){await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch{return Response.json({error:"The upload could not be saved. Please try again."},{status:500})}
}

import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { stagedMedia } from "@/lib/admin-media";

export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData();
    const title=String(form.get("title")||"").trim().slice(0,160),description=String(form.get("description")||"").trim().slice(0,4000),category=String(form.get("category")||""),contentKind=String(form.get("contentKind")||"video"),level=String(form.get("level")||"Beginner"),format=String(form.get("displayFormat")||"landscape"),file=form.get("video"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),"video");
    const sourceUrl=contentKind==="youtube"?youtubeEmbedUrl(String(form.get("sourceUrl")||"")):null;
    if(!["video","speaking","youtube"].includes(contentKind)||!title||!["landscape","vertical"].includes(format)||!(await getVideoCategories(contentKind as "video"|"speaking"|"youtube")).some(c=>c.id===category))return Response.json({error:"Add a title and choose a valid section and folder."},{status:400});
    if(contentKind==="youtube"&&!sourceUrl)return Response.json({error:"Enter a valid YouTube video or Shorts URL."},{status:400});
    if(contentKind!=="youtube"&&!uploaded&&(!(file instanceof File)||!(["video/mp4","video/webm"] as string[]).includes(file.type)||file.size>90*1024*1024||file.size===0))return Response.json({error:"Choose an MP4 or WebM video up to 100 MB."},{status:400});
    const id=crypto.randomUUID(),key=contentKind==="youtube"?"":(uploaded?.key||(file instanceof File?`video-lessons/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,80)}`:""));
    if(key&&!uploaded&&file instanceof File)await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().insert(videoLessons).values({id,title,description,category,contentKind,level,mediaKey:key,mimeType:uploaded?.mimeType||(key&&file instanceof File?file.type:"text/html"),sourceUrl,displayFormat:format,createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch{return Response.json({error:"The upload could not be saved. Please try again."},{status:500})}
}

import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { stagedMedia } from "@/lib/admin-media";

const allowedAudio=["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"];
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData(),category=String(form.get("category")||""),title=String(form.get("title")||"").trim(),body=String(form.get("body")||"").trim(),translation=String(form.get("translation")||"").trim(),example=String(form.get("example")||"").trim(),exampleTranslation=String(form.get("exampleTranslation")||"").trim(),audio=form.get("audio"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),"audio");
    if(!(await getVideoCategories("tips")).some(item=>item.id===category)||!title||title.length>160||!body||body.length>3000||translation.length>3000||example.length>1000||exampleTranslation.length>1000)return Response.json({error:"Choose a Quick Tips folder and add a short title and text."},{status:400});
    if(!uploaded&&audio instanceof File&&audio.size>0&&(!allowedAudio.includes(audio.type)||audio.size>90*1024*1024))return Response.json({error:"Use an MP3, WAV, OGG, WebM, or M4A audio file under 90 MB."},{status:400});
    const id=crypto.randomUUID(),key=uploaded?.key||(audio instanceof File&&audio.size>0?`quick-tips/${id}/audio`:null);
    if(key&&!uploaded&&audio instanceof File)await getMediaBucket().put(key,audio.stream(),{httpMetadata:{contentType:audio.type}});
    try{await getDb().insert(quickTipLessons).values({id,category,title,body,translation,example,exampleTranslation,audioKey:key,mimeType:uploaded?.mimeType||(key&&audio instanceof File?audio.type:null),status:"draft",createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch{return Response.json({error:"Could not save the Quick Tip. Please try again."},{status:500})}
}

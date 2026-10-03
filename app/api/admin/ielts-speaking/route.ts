import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";

const allowedAudio=["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"];
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData();
    const category=String(form.get("category")||""),question=String(form.get("question")||"").trim(),cue=String(form.get("cue")||"").trim(),answer=String(form.get("answer")||"").trim(),translation=String(form.get("translation")||"").trim(),audio=form.get("audio");
    const categories=await getVideoCategories("ielts");
    if(!categories.some(item=>item.id===category)||!question||question.length>240||!answer||answer.length>6000||cue.length>1200||translation.length>6000)return Response.json({error:"Choose an IELTS folder and add a question and model answer."},{status:400});
    if(audio instanceof File&&audio.size>0&&(!allowedAudio.includes(audio.type)||audio.size>90*1024*1024))return Response.json({error:"Use an MP3, WAV, OGG, WebM, or M4A audio file under 90 MB."},{status:400});
    const id=crypto.randomUUID(),key=audio instanceof File&&audio.size>0?`ielts-examples/${id}/model-audio`:null;
    if(key&&audio instanceof File)await getMediaBucket().put(key,audio.stream(),{httpMetadata:{contentType:audio.type}});
    try{await getDb().insert(ieltsSpeakingExamples).values({id,category,question,cue,answer,translation,audioKey:key,mimeType:key&&audio instanceof File?audio.type:null,status:"draft",createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch{return Response.json({error:"Could not save the IELTS example. Please try again."},{status:500})}
}

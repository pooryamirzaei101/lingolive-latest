import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { stagedMedia } from "@/lib/admin-media";
import {parseReadingQuestions,parseCuePoints} from "@/lib/ielts-practice";

const allowedAudio=["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"];
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData();
    const category=String(form.get("category")||""),question=String(form.get("question")||"").trim(),cue=String(form.get("cue")||"").trim(),answer=String(form.get("answer")||"").trim(),translation=String(form.get("translation")||"").trim(),kind=String(form.get("kind")||"listening"),track=String(form.get("track")||""),vocabulary=String(form.get("vocabulary")||"").trim(),audio=form.get("audio"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),"audio");
    const categories=await getVideoCategories("ielts");
    if(!categories.some(item=>item.id===category)||!question||question.length>240||!['listening','reading','speaking_video'].includes(kind)||kind==='listening'&&!answer&&!uploaded&&!(audio instanceof File&&audio.size>0)||kind==='reading'&&!answer||answer.length>50000||cue.length>12000||translation.length>6000||vocabulary.length>4000||!['','academic','general'].includes(track))return Response.json({error:"Choose an IELTS folder and add the required question, passage, or audio."},{status:400});
    const questions=kind==='reading'?parseReadingQuestions(String(form.get('questions')||'')):[],cuePoints=kind==='speaking_video'?parseCuePoints(String(form.get('cuePoints')||'')):[],scrollSpeed=Number(form.get('scrollSpeed')||32),videoUrl=String(form.get('videoUrl')||'').trim();
    if(videoUrl&&!/^https:\/\/[\w.-]+(?:\/[^\s]*)?$/.test(videoUrl))return Response.json({error:'Use an HTTPS video link.'},{status:400});
    if(kind==='speaking_video'&&(!answer||!Number.isFinite(scrollSpeed)||scrollSpeed<10||scrollSpeed>120))return Response.json({error:'Add teleprompter text and a scroll speed from 10 to 120.'},{status:400});
    if(!uploaded&&audio instanceof File&&audio.size>0&&(!allowedAudio.includes(audio.type)||audio.size>90*1024*1024))return Response.json({error:"Use an MP3, WAV, OGG, WebM, or M4A audio file under 90 MB."},{status:400});
    const id=crypto.randomUUID(),key=uploaded?.key||(audio instanceof File&&audio.size>0?`ielts-examples/${id}/model-audio`:null);
    if(key&&!uploaded&&audio instanceof File)await getMediaBucket().put(key,audio.stream(),{httpMetadata:{contentType:audio.type}});
    try{await getDb().insert(ieltsSpeakingExamples).values({id,category,question,cue,answer,translation,kind,track,questions:JSON.stringify(questions),vocabulary,audioKey:key,mimeType:uploaded?.mimeType||(key&&audio instanceof File?audio.type:null),videoUrl:videoUrl||null,scrollSpeed,cuePoints:JSON.stringify(cuePoints),status:"draft",createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch{return Response.json({error:"Could not save the IELTS example. Please try again."},{status:500})}
}

import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples,mediaTranscripts,transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import {parseTranscript} from "@/lib/video";
import {parseReadingQuestions,parseCuePoints} from "@/lib/ielts-practice";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{
    const current=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();
    if(!current)return Response.json({error:"Example not found"},{status:404});
    const body=await request.json() as {category?:string;question?:string;cue?:string;answer?:string;translation?:string;status?:string;description?:string;level?:string;band?:string;format?:string;track?:string;questions?:string;vocabulary?:string;scrollSpeed?:number;cuePoints?:string;videoUrl?:string;displayFormat?:string};
    const category=body.category??current.category,question=(body.question??current.question).trim(),cue=(body.cue??current.cue).trim(),answer=(body.answer??current.answer).trim(),translation=(body.translation??current.translation).trim(),status=body.status??current.status,track=body.track??current.track,vocabulary=(body.vocabulary??current.vocabulary).trim(),scrollSpeed=body.scrollSpeed===undefined?current.scrollSpeed:Number(body.scrollSpeed);
    if(!(await getVideoCategories("ielts")).some(item=>item.id===category)||!question||question.length>240||answer.length>50000||cue.length>12000||translation.length>6000||vocabulary.length>4000||!['','academic','general'].includes(track)||!Number.isFinite(scrollSpeed)||scrollSpeed<10||scrollSpeed>120||!["draft","published"].includes(status))return Response.json({error:"Check the folder, question, answer, and publication status."},{status:400});
    const displayFormat=body.displayFormat??current.displayFormat;if(!["landscape","vertical","square"].includes(displayFormat))return Response.json({error:"Choose a supported video format."},{status:400});
    const description=(body.description??current.description).trim(),level=body.level??current.level,band=(body.band??current.band).trim(),format=body.format??current.format;
    if(description.length>1000||band.length>40||!["Beginner","Intermediate","Advanced"].includes(level)||!["audio","reading","audio_text","video"].includes(format))return Response.json({error:"Check the lesson description, difficulty, band, and format."},{status:400});
    const questions=body.questions===undefined?current.questions:JSON.stringify(parseReadingQuestions(body.questions)),cuePoints=body.cuePoints===undefined?current.cuePoints:JSON.stringify(parseCuePoints(body.cuePoints));
    const videoUrl=body.videoUrl===undefined?current.videoUrl:body.videoUrl.trim();
    if(videoUrl&&!/^https:\/\/[\w.-]+(?:\/[^\s]*)?$/.test(videoUrl))return Response.json({error:'Use an HTTPS video link.'},{status:400});
    if(status==='published'&&current.kind==='reading'&&(!answer||!JSON.parse(questions).length))return Response.json({error:'Add a passage and at least one question before publishing.'},{status:400});
    if(status==='published'&&current.kind==='speaking_video'&&!current.videoKey&&!videoUrl)return Response.json({error:'Upload a model video before publishing.'},{status:400});
    if(status==="published"&&current.kind==='listening'&&!current.audioKey)return Response.json({error:"Add model answer audio before publishing."},{status:400});
    if(status==="published"&&(current.kind==='listening'||current.kind==='speaking_video'||current.kind==='reading'&&current.audioKey)&&current.status!=="published"){
      const transcript=await getDb().select().from(mediaTranscripts).where(eq(mediaTranscripts.id,`ielts:${id}`)).get(),job=await getDb().select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,`ielts:${id}`)).get();
      if(!transcript||!parseTranscript(transcript.segments).length||job?.state!=="approved")return Response.json({error:"Apply, review, and save the timestamped English transcript before publishing."},{status:400});
    }
    await getDb().update(ieltsSpeakingExamples).set({category,question,description,level,band,format,cue,answer,translation,track,questions,vocabulary,scrollSpeed,cuePoints,videoUrl:videoUrl||null,displayFormat,status}).where(eq(ieltsSpeakingExamples.id,id));
    return Response.json({id,status});
  }catch{return Response.json({error:"Could not update the example."},{status:500})}
}

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{const current=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!current)return Response.json({error:"Example not found"},{status:404});await getDb().delete(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id));if(current.audioKey)await getMediaBucket().delete(current.audioKey);if(current.videoKey)await getMediaBucket().delete(current.videoKey);if(current.pdfKey)await getMediaBucket().delete(current.pdfKey);if(current.thumbnailKey)await getMediaBucket().delete(current.thumbnailKey);return Response.json({deleted:true})}catch{return Response.json({error:"Could not delete the example."},{status:500})}
}

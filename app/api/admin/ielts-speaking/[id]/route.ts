import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { isSpeakingFolder } from "@/lib/ielts-speaking";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{
    const current=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();
    if(!current)return Response.json({error:"Example not found"},{status:404});
    const body=await request.json() as {category?:string;question?:string;cue?:string;answer?:string;translation?:string;status?:string};
    const category=body.category??current.category,question=(body.question??current.question).trim(),cue=(body.cue??current.cue).trim(),answer=(body.answer??current.answer).trim(),translation=(body.translation??current.translation).trim(),status=body.status??current.status;
    if(!isSpeakingFolder(category,await getVideoCategories("ielts"))||category==="ielts-speaking"||!question||question.length>240||!answer||answer.length>6000||cue.length>1200||translation.length>6000||!["draft","published"].includes(status))return Response.json({error:"Check the category, question, answer, and publication status."},{status:400});
    if(status==="published"&&!current.audioKey)return Response.json({error:"Add model answer audio before publishing."},{status:400});
    await getDb().update(ieltsSpeakingExamples).set({category,question,cue,answer,translation,status}).where(eq(ieltsSpeakingExamples.id,id));
    return Response.json({id,status});
  }catch{return Response.json({error:"Could not update the example."},{status:500})}
}

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{const current=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!current)return Response.json({error:"Example not found"},{status:404});await getDb().delete(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id));if(current.audioKey)await getMediaBucket().delete(current.audioKey);return Response.json({deleted:true})}catch{return Response.json({error:"Could not delete the example."},{status:500})}
}

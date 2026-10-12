import {eq} from "drizzle-orm";
import {getDb,getMediaBucket} from "@/db";
import {quickTipLessons} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {getFlashcard} from "@/lib/flashcards";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
 try{const card=await getFlashcard(id,true);if(!card)return Response.json({error:"Flashcard not found"},{status:404});const input=await request.json() as Partial<{title:string;body:string;example:string;status:string}>;
  const title=(input.title??card.title).trim(),body=(input.body??card.body).trim(),example=(input.example??card.example).trim(),status=input.status??card.status;
  if(!title||title.length>120||body.length>2000||example.length>1000||(!body&&!example)||!["draft","published"].includes(status))return Response.json({error:"Add a phrase and at least one example or explanation."},{status:400});
  if(status==="published"&&!card.audioKey)return Response.json({error:"Add voice audio before publishing."},{status:400});
  await getDb().update(quickTipLessons).set({title,body,example,status}).where(eq(quickTipLessons.id,id));return Response.json({id,status});
 }catch{return Response.json({error:"Could not update the flashcard."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
 try{const card=await getFlashcard(id,true);if(!card)return Response.json({error:"Flashcard not found"},{status:404});await getDb().delete(quickTipLessons).where(eq(quickTipLessons.id,id));if(card.audioKey)await getMediaBucket().delete(card.audioKey).catch(()=>{});return Response.json({deleted:true})}catch{return Response.json({error:"Could not delete the flashcard."},{status:500})}
}

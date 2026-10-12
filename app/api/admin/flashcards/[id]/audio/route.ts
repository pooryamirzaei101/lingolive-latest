import {eq} from "drizzle-orm";
import {getDb,getMediaBucket} from "@/db";
import {quickTipLessons} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {stagedMedia} from "@/lib/admin-media";
import {getFlashcard} from "@/lib/flashcards";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
 try{const card=await getFlashcard(id,true);if(!card)return Response.json({error:"Flashcard not found"},{status:404});const form=await request.formData(),audio=await stagedMedia(String(form.get("uploadKey")||""),"audio");if(!audio)return Response.json({error:"Choose a supported audio file up to 100 MB."},{status:400});
  await getDb().update(quickTipLessons).set({audioKey:audio.key,mimeType:audio.mimeType}).where(eq(quickTipLessons.id,id));if(card.audioKey&&card.audioKey!==audio.key)await getMediaBucket().delete(card.audioKey).catch(()=>{});return Response.json({saved:true});
 }catch{return Response.json({error:"Could not save audio."},{status:500})}
}

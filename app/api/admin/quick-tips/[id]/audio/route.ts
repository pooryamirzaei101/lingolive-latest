import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { stagedMedia } from "@/lib/admin-media";
const allowed=["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"];
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const current=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!current)return Response.json({error:"Tip not found"},{status:404});
    const form=await request.formData(),file=form.get("audio"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),"audio");
    if(!uploaded&&(!(file instanceof File)||!file.size||file.size>90*1024*1024||!allowed.includes(file.type)))return Response.json({error:"Choose an audio file up to 100 MB."},{status:400});
    const key=uploaded?.key||`quick-tips/${id}/audio`;if(!uploaded&&file instanceof File)await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().update(quickTipLessons).set({audioKey:key,mimeType:uploaded?.mimeType||(file as File).type}).where(eq(quickTipLessons.id,id))}catch(error){if(uploaded)await getMediaBucket().delete(key);throw error}
    if(current.audioKey&&current.audioKey!==key)await getMediaBucket().delete(current.audioKey).catch(()=>{});return Response.json({saved:true});
  }catch{return Response.json({error:"Could not save audio."},{status:500})}
}

import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const current=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!current)return Response.json({error:"Tip not found"},{status:404});const form=await request.formData(),file=form.get("audio");if(!(file instanceof File)||!file.size||file.size>10*1024*1024||!["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"].includes(file.type))return Response.json({error:"Choose an audio file under 10 MB."},{status:400});const key=`quick-tips/${id}/audio`;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});await getDb().update(quickTipLessons).set({audioKey:key,mimeType:file.type}).where(eq(quickTipLessons.id,id));return Response.json({saved:true})}catch{return Response.json({error:"Could not save audio."},{status:500})}
}

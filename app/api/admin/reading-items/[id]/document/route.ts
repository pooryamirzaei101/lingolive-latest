import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { stagedMedia } from "@/lib/admin-media";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Reading lesson not found"},{status:404});const form=await request.formData(),key=String(form.get("uploadKey")||""),document=await stagedMedia(key,"document");if(!document)return Response.json({error:"Upload a PDF up to 100 MB."},{status:400});try{await getDb().update(readingItems).set({documentKey:document.key,documentMimeType:"application/pdf",status:"draft"}).where(eq(readingItems.id,id))}catch(error){await getMediaBucket().delete(document.key).catch(()=>{});throw error}if(item.documentKey&&item.documentKey!==document.key)await getMediaBucket().delete(item.documentKey).catch(()=>{});return Response.json({saved:true})}catch{return Response.json({error:"Could not save the PDF."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Reading lesson not found"},{status:404});await getDb().update(readingItems).set({documentKey:null,documentMimeType:null,status:"draft"}).where(eq(readingItems.id,id));if(item.documentKey)await getMediaBucket().delete(item.documentKey);return Response.json({deleted:true})}catch{return Response.json({error:"Could not remove the PDF."},{status:500})}
}

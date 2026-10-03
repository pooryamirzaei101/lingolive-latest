import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Reading lesson not found"},{status:404});const form=await request.formData(),file=form.get("document");if(!(file instanceof File)||!file.size||file.size>40*1024*1024||file.type!=="application/pdf"||!file.name.toLowerCase().endsWith(".pdf"))return Response.json({error:"Choose a PDF under 40 MB."},{status:400});const key=`reading/${id}/${crypto.randomUUID()}.pdf`;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:"application/pdf"}});try{await getDb().update(readingItems).set({documentKey:key,documentMimeType:"application/pdf",status:"draft"}).where(eq(readingItems.id,id))}catch(error){await getMediaBucket().delete(key);throw error}if(item.documentKey)await getMediaBucket().delete(item.documentKey).catch(()=>{});return Response.json({saved:true})}catch{return Response.json({error:"Could not save the PDF."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Reading lesson not found"},{status:404});await getDb().update(readingItems).set({documentKey:null,documentMimeType:null,status:"draft"}).where(eq(readingItems.id,id));if(item.documentKey)await getMediaBucket().delete(item.documentKey);return Response.json({deleted:true})}catch{return Response.json({error:"Could not remove the PDF."},{status:500})}
}

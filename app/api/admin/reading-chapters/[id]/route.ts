import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingBlocks, readingChapters, readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const data=await request.json() as {title?:string;body?:string;translation?:string},title=data.title?.trim()||"",body=data.body?.trim()||"",translation=data.translation?.trim()||"";if(!title||title.length>120||body.length>50000||translation.length>50000)return Response.json({error:"Add a unit title. Text is optional when adding slides, PDFs, or audio."},{status:400});const existing=await getDb().select().from(readingChapters).where(eq(readingChapters.id,id)).get();if(!existing)return Response.json({error:"Chapter not found"},{status:404});await getDb().update(readingChapters).set({title,body,translation}).where(eq(readingChapters.id,id));return Response.json({ok:true})}catch{return Response.json({error:"Could not save the chapter."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const existing=await getDb().select().from(readingChapters).where(eq(readingChapters.id,id)).get();if(!existing)return Response.json({error:"Chapter not found"},{status:404});const item=await getDb().select().from(readingItems).where(eq(readingItems.id,existing.itemId)).get();if(item?.status==="published"){const chapters=await getDb().select({id:readingChapters.id}).from(readingChapters).where(eq(readingChapters.itemId,existing.itemId)).all();if(chapters.length===1)return Response.json({error:"Unpublish the lesson before deleting its only chapter."},{status:400})}const blocks=await getDb().select().from(readingBlocks).where(eq(readingBlocks.chapterId,id)).all();await getDb().batch([getDb().delete(readingBlocks).where(eq(readingBlocks.chapterId,id)),getDb().delete(readingChapters).where(eq(readingChapters.id,id))]);for(const block of blocks)if(block.mediaKey)await getMediaBucket().delete(block.mediaKey).catch(()=>{});return Response.json({ok:true})}catch{return Response.json({error:"Could not delete the chapter."},{status:500})}
}

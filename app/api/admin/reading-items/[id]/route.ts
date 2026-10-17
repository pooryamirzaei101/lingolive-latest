import { eq, inArray } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingBlocks, readingChapters, readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const data=await request.json() as {title?:string;description?:string;category?:string;level?:string;status?:string},item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Lesson not found"},{status:404});
    if(data.status){if(data.status!=="draft"&&data.status!=="published")return Response.json({error:"Invalid status"},{status:400});if(data.status==="published"){
      const units=await getDb().select({id:readingChapters.id,body:readingChapters.body}).from(readingChapters).where(eq(readingChapters.itemId,id)).all();
      if(!units.length)return Response.json({error:"Add a unit before publishing."},{status:400});
      if(!item.documentKey&&!units.some(unit=>unit.body.trim())&&!await getDb().select({id:readingBlocks.id}).from(readingBlocks).where(inArray(readingBlocks.chapterId,units.map(unit=>unit.id))).get())return Response.json({error:"Add text, a PDF, a slide, picture, or voice to a unit before publishing."},{status:400});
    }await getDb().update(readingItems).set({status:data.status}).where(eq(readingItems.id,id))}
    else {const title=data.title?.trim()||"",category=data.category||"";if(!title||title.length>160||!(await getVideoCategories("reading")).some(c=>c.id===category))return Response.json({error:"Enter a title and choose a category."},{status:400});await getDb().update(readingItems).set({title,category,description:(data.description||"").trim().slice(0,1200),level:["Beginner","Intermediate","Advanced"].includes(data.level||"")?data.level!:"Beginner"}).where(eq(readingItems.id,id))}
    return Response.json({ok:true});
  }catch{return Response.json({error:"Could not save the reading lesson."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item)return Response.json({error:"Lesson not found"},{status:404});const chapters=await getDb().select({id:readingChapters.id}).from(readingChapters).where(eq(readingChapters.itemId,id)).all(),blocks=(await Promise.all(chapters.map(chapter=>getDb().select().from(readingBlocks).where(eq(readingBlocks.chapterId,chapter.id)).all()))).flat();await getDb().batch([getDb().delete(readingBlocks).where(inArray(readingBlocks.chapterId,chapters.map(chapter=>chapter.id))),getDb().delete(readingChapters).where(eq(readingChapters.itemId,id)),getDb().delete(readingItems).where(eq(readingItems.id,id))]);for(const block of blocks)if(block.mediaKey)await getMediaBucket().delete(block.mediaKey).catch(()=>{});if(item.documentKey)await getMediaBucket().delete(item.documentKey).catch(()=>{});return Response.json({ok:true})}catch{return Response.json({error:"Could not delete the reading lesson."},{status:500})}
}

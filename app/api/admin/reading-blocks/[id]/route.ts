import {and,asc,eq} from "drizzle-orm";
import {getDb,getMediaBucket} from "@/db";
import {readingBlocks} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
 try{const block=await getDb().select().from(readingBlocks).where(eq(readingBlocks.id,id)).get();if(!block)return Response.json({error:"Content block not found"},{status:404});const input=await request.json() as {body?:string;move?:"up"|"down"};
  if(input.move){if(input.move!=="up"&&input.move!=="down")return Response.json({error:"Invalid direction"},{status:400});const siblings=await getDb().select().from(readingBlocks).where(eq(readingBlocks.chapterId,block.chapterId)).orderBy(asc(readingBlocks.position)).all(),index=siblings.findIndex(row=>row.id===id),neighbor=siblings[index+(input.move==="up"?-1:1)];if(!neighbor)return Response.json({error:"Already at the edge"},{status:400});await getDb().batch([getDb().update(readingBlocks).set({position:neighbor.position}).where(eq(readingBlocks.id,id)),getDb().update(readingBlocks).set({position:block.position}).where(eq(readingBlocks.id,neighbor.id))]);return Response.json({saved:true})}
  if(typeof input.body!=="string")return Response.json({error:"Text is required."},{status:400});const body=input.body.trim();if(!body&&block.kind==="text"||body.length>(block.kind==="text"?50000:300))return Response.json({error:"Enter valid text or a short caption."},{status:400});await getDb().update(readingBlocks).set({body}).where(and(eq(readingBlocks.id,id),eq(readingBlocks.chapterId,block.chapterId)));return Response.json({saved:true});
 }catch{return Response.json({error:"Could not update this content block."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
 try{const block=await getDb().select().from(readingBlocks).where(eq(readingBlocks.id,id)).get();if(!block)return Response.json({error:"Content block not found"},{status:404});await getDb().delete(readingBlocks).where(eq(readingBlocks.id,id));if(block.mediaKey)await getMediaBucket().delete(block.mediaKey).catch(()=>{});return Response.json({deleted:true})}catch{return Response.json({error:"Could not delete this content block."},{status:500})}
}

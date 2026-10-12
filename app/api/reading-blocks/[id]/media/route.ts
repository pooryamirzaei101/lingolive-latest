import {eq} from "drizzle-orm";
import {getDb,getMediaBucket} from "@/db";
import {readingBlocks,readingChapters,readingItems} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {canLearn} from "@/lib/membership";
import {mediaResponse} from "@/lib/media-response";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 try{const block=await getDb().select().from(readingBlocks).where(eq(readingBlocks.id,id)).get();if(!block?.mediaKey)return new Response("Not found",{status:404});const chapter=await getDb().select().from(readingChapters).where(eq(readingChapters.id,block.chapterId)).get(),item=chapter&&await getDb().select().from(readingItems).where(eq(readingItems.id,chapter.itemId)).get();if(!item||(item.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});if(!await canLearn("reading",item.id))return new Response("Membership required",{status:403});return mediaResponse(getMediaBucket(),block.mediaKey,block.mimeType||"application/octet-stream",request)}catch{return new Response("Media unavailable",{status:503})}
}
export const HEAD=GET;

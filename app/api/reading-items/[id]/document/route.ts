import {canLearn} from '@/lib/membership';
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { mediaResponse } from "@/lib/media-response";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item?.documentKey||(item.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});if(!await canLearn('reading',id))return new Response('Membership required',{status:403});return mediaResponse(getMediaBucket(),item.documentKey,"application/pdf",request)}catch{return new Response("Document unavailable",{status:503})}
}
export const HEAD=GET;

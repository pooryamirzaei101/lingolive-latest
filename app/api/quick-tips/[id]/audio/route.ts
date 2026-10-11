import {mediaResponse} from '@/lib/media-response';
import {canLearn} from '@/lib/membership';
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  try{const tip=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!tip||!tip.audioKey||(tip.status!=="published"&&!await isAdmin()))return new Response("Not found",{status:404});if(!await canLearn('tips',id))return new Response('Membership required',{status:403});return mediaResponse(getMediaBucket(),tip.audioKey,tip.mimeType||'audio/mpeg',request)}catch{return new Response("Audio unavailable",{status:503})}
}

export const HEAD=GET;

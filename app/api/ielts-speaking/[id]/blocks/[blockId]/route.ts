import {and,eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {ieltsBlocks,ieltsSpeakingExamples} from '@/db/schema';
import {canLearn} from '@/lib/membership';
import {isAdmin} from '@/lib/admin';
import {mediaResponse} from '@/lib/media-response';
export async function GET(request:Request,{params}:{params:Promise<{id:string;blockId:string}>}){const {id,blockId}=await params,db=getDb(),[lesson,block]=await Promise.all([db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get(),db.select().from(ieltsBlocks).where(and(eq(ieltsBlocks.lessonId,id),eq(ieltsBlocks.id,blockId))).get()]);if(!lesson||!block?.mediaKey||lesson.status!=='published'&&!await isAdmin())return new Response('Not found',{status:404});if(!await canLearn('ielts',id))return new Response('Membership required',{status:403});return mediaResponse(getMediaBucket(),block.mediaKey,block.mimeType||'',request)}
export const HEAD=GET;

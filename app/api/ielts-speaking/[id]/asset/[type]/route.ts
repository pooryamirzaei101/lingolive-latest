import {eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {ieltsSpeakingExamples} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {canLearn} from '@/lib/membership';
import {mediaResponse} from '@/lib/media-response';
export async function GET(request:Request,{params}:{params:Promise<{id:string;type:string}>}){
 const {id,type}=await params;if(type!=='pdf'&&type!=='thumbnail')return new Response('Not found',{status:404});
 const row=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();
 if(!row||row.status!=='published'&&!await isAdmin())return new Response('Not found',{status:404});
 if(type==='pdf'&&!await canLearn('ielts',id))return new Response('Membership required',{status:403});
 const key=type==='pdf'?row.pdfKey:row.thumbnailKey;if(!key)return new Response('Not found',{status:404});
 return mediaResponse(getMediaBucket(),key,type==='pdf'?'application/pdf':'',request);
}
export const HEAD=GET;

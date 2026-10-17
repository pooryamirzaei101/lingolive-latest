import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {contentAccess,ieltsSpeakingExamples} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id}=await params,body=await request.json() as {free?:boolean};if(typeof body.free!=='boolean')return Response.json({error:'Choose Free or Premium.'},{status:400});
 const row=await getDb().select({id:ieltsSpeakingExamples.id}).from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!row)return Response.json({error:'Lesson not found'},{status:404});
 await getDb().insert(contentAccess).values({id:`ielts:${id}`,free:Number(body.free)}).onConflictDoUpdate({target:contentAccess.id,set:{free:Number(body.free)}});
 return Response.json({free:body.free});
}

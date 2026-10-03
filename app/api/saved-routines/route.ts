import {canLearn} from '@/lib/membership';
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedRoutines } from "@/db/schema";
import { getRoutine } from "@/lib/routines";

async function handle(request:Request,remove=false){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to save routines."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  try{
    const body=await request.json() as {lessonId?:unknown},lessonId=body.lessonId;
    if(typeof lessonId!=="string"||lessonId.length>100)return Response.json({error:"Choose a routine lesson."},{status:400});
    const db=getDb();
    if(remove){await db.delete(savedRoutines).where(and(eq(savedRoutines.userId,user.userId),eq(savedRoutines.lessonId,lessonId)));return Response.json({saved:false})}
    const lesson=await getRoutine(lessonId);if(!lesson||lesson.status!=="published")return Response.json({error:"This lesson is unavailable."},{status:404});
    if(!await canLearn('routine',lessonId))return Response.json({error:'Membership required.'},{status:403});
    await db.insert(savedRoutines).values({id:crypto.randomUUID(),userId:user.userId,lessonId,createdAt:Date.now()}).onConflictDoNothing();return Response.json({saved:true});
  }catch{return Response.json({error:"Could not update your saved routines."},{status:500})}
}
export async function POST(request:Request){return handle(request)}
export async function DELETE(request:Request){return handle(request,true)}

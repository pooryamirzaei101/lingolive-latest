import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedSentences } from "@/db/schema";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to manage your collection."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  const {id}=await params;
  try{await getDb().delete(savedSentences).where(and(eq(savedSentences.id,id),eq(savedSentences.userId,user.userId)));return Response.json({deleted:true})}
  catch{return Response.json({error:"Could not remove this sentence."},{status:500})}
}

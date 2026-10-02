import { eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { learnerPreferences } from "@/db/schema";

import { isTranslationLanguage } from "@/lib/languages";
export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in before creating a learner profile."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  try{
    const body=await request.json() as {translationLanguage?:string},translationLanguage=body.translationLanguage;
    if(!isTranslationLanguage(translationLanguage))return Response.json({error:"Choose a translation language."},{status:400});
    const existing=await getDb().select().from(learnerPreferences).where(eq(learnerPreferences.userId,user.userId)).get();
    if(existing)await getDb().update(learnerPreferences).set({translationLanguage}).where(eq(learnerPreferences.userId,user.userId));
    else await getDb().insert(learnerPreferences).values({userId:user.userId,translationLanguage});
    return Response.json({ok:true,translationLanguage});
  }catch{return Response.json({error:"Could not save your profile. Please try again."},{status:500})}
}

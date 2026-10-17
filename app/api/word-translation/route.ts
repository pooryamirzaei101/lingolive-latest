import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedVocabulary } from "@/db/schema";
import { normalizeEnglish } from "@/lib/word-translations";
import { preferredLanguage, translateEnglish } from "@/lib/translation-service";

export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to see your preferred language."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  try{
    const body=await request.json() as {word?:unknown;manualPersian?:unknown};
    const word=typeof body.word==="string"?normalizeEnglish(body.word):"";
    if(!word||word.length>100||!/^\p{L}+(?:[’'\-]\p{L}+)*(?: \p{L}+(?:[’'\-]\p{L}+)*){0,7}$/u.test(word))return Response.json({error:"Select a word or a short phrase."},{status:400});
    const language=await preferredLanguage(user.userId),manualPersian=typeof body.manualPersian==="string"?body.manualPersian.slice(0,250):undefined;
    if(!word.includes(" ")){
      const saved=await getDb().select({translation:savedVocabulary.translation}).from(savedVocabulary).where(and(eq(savedVocabulary.userId,user.userId),eq(savedVocabulary.word,word),eq(savedVocabulary.translationLanguage,language))).get();
      if(saved?.translation)return Response.json({word,language,translation:saved.translation,source:"saved"});
    }
    const result=await translateEnglish(word,language,manualPersian,user.userId);
    return Response.json({word,language,...result});
  }catch{return Response.json({error:"Translation is temporarily unavailable."},{status:500})}
}

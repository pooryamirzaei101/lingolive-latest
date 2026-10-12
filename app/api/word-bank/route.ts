import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedVocabulary } from "@/db/schema";
import { normalizeEnglish } from "@/lib/word-translations";
import { preferredLanguage, translateEnglish } from "@/lib/translation-service";

export async function POST(request:Request){
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:"Sign in to save words to your Word Bank."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  try{
    const body=await request.json() as {word?:unknown;manualPersian?:unknown;source?:unknown;exampleSentence?:unknown;lessonTitle?:unknown;sourceSection?:unknown};
    const word=typeof body.word==="string"?normalizeEnglish(body.word):"";
    if(!word||word.length>100||!/^\p{L}+(?:[’'\-]\p{L}+)*(?: \p{L}+(?:[’'\-]\p{L}+)*){0,7}$/u.test(word))return Response.json({error:"Select a word or a short phrase."},{status:400});
    const language=await preferredLanguage(user.userId);
    const manualPersian=typeof body.manualPersian==="string"?body.manualPersian.slice(0,250):undefined;
    const source=typeof body.source==="string"&&body.source.startsWith("/")&&!body.source.startsWith("//")?body.source.slice(0,300):"/";
    const exampleSentence=typeof body.exampleSentence==="string"?body.exampleSentence.trim().slice(0,1000):"",lessonTitle=typeof body.lessonTitle==="string"?body.lessonTitle.trim().slice(0,240):"",sourceSection=typeof body.sourceSection==="string"?body.sourceSection.trim().slice(0,60):"";
    const db=getDb();
    const existing=await db.select().from(savedVocabulary).where(and(eq(savedVocabulary.userId,user.userId),eq(savedVocabulary.word,word),eq(savedVocabulary.translationLanguage,language))).get();
    if(existing){
      if(existing.translation)return Response.json({saved:true,alreadySaved:true,id:existing.id,translation:existing.translation,language});
    }
    const {translation}=await translateEnglish(word,language,manualPersian,user.userId);
    if(!translation)return Response.json({error:"Translation is unavailable for this language. This word was not saved."},{status:503});
    if(existing){await db.update(savedVocabulary).set({translation}).where(eq(savedVocabulary.id,existing.id));return Response.json({saved:true,alreadySaved:true,id:existing.id,translation,language})}
    const id=crypto.randomUUID();
    await db.insert(savedVocabulary).values({id,userId:user.userId,word,translation,translationLanguage:language,sourceLessonId:source,exampleSentence,lessonTitle,sourceSection,createdAt:Date.now()});
    return Response.json({saved:true,id,translation,language},{status:201});
  }catch{return Response.json({error:"Could not save this word. Please try again."},{status:500})}
}

export async function DELETE(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Sign in to manage your Word Bank."},{status:401});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  try{
    const body=await request.json() as {id?:unknown};
    if(typeof body.id!=="string"||!body.id)return Response.json({error:"Choose a word to remove."},{status:400});
    await getDb().delete(savedVocabulary).where(and(eq(savedVocabulary.id,body.id),eq(savedVocabulary.userId,user.userId)));
    return Response.json({removed:true});
  }catch{return Response.json({error:"Could not remove this word."},{status:500})}
}

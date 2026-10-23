import {cachedTranslation,savedTranslation,saveTranslation} from "@/lib/translation-cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { learnerPreferences } from "@/db/schema";
import { isTranslationLanguage, type TranslationLanguage } from "@/lib/languages";
import { normalizeEnglish, translateWord } from "@/lib/word-translations";

const settings=process.env as {TRANSLATION_API_URL?:string;TRANSLATION_API_KEY?:string};
export function translationServiceConnected(){
  try{const url=new URL(settings.TRANSLATION_API_URL||"");return url.protocol==="https:"&&!!url.hostname}catch{return false}
}
export async function preferredLanguage(userId:string):Promise<TranslationLanguage>{
  const row=await getDb().select({language:learnerPreferences.translationLanguage}).from(learnerPreferences).where(eq(learnerPreferences.userId,userId)).get();
  return isTranslationLanguage(row?.language)?row.language:"fa";
}
export async function translateEnglish(text:string,language:TranslationLanguage,manualPersian?:string,userId?:string):Promise<{translation:string;source:string}>{
 const term=normalizeEnglish(text);
 if(!term)return {translation:"",source:"unavailable"};
 try{const saved=await savedTranslation(term,language);if(saved?.state==='ready')return {translation:saved.translation,source:saved.source}}catch{}
 if(language==="fa"){const reviewed=translateWord(term);if(reviewed){try{await saveTranslation(term,language,reviewed.slice(0,250))}catch{}return {translation:reviewed.slice(0,250),source:"manual"}}if(manualPersian?.trim())return {translation:manualPersian.trim().slice(0,250),source:"manual"}}
 try{return await cachedTranslation(term,language,userId)}catch{return {translation:"",source:"unavailable"}}
}

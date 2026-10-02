import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { learnerPreferences } from "@/db/schema";
import { isTranslationLanguage, type TranslationLanguage } from "@/lib/languages";
import { normalizeEnglish, translateWord } from "@/lib/word-translations";

const settings=env as unknown as {TRANSLATION_API_URL?:string;TRANSLATION_API_KEY?:string};
export function translationServiceConnected(){
  try{const url=new URL(settings.TRANSLATION_API_URL||"");return url.protocol==="https:"&&!!url.hostname}catch{return false}
}
export async function preferredLanguage(userId:string):Promise<TranslationLanguage>{
  const row=await getDb().select({language:learnerPreferences.translationLanguage}).from(learnerPreferences).where(eq(learnerPreferences.userId,userId)).get();
  return isTranslationLanguage(row?.language)?row.language:"fa";
}
export async function translateEnglish(text:string,language:TranslationLanguage,manualPersian?:string):Promise<{translation:string;source:"manual"|"provider"|"unavailable"}>{
  const term=normalizeEnglish(text);
  if(language==="fa"){
    const reviewed=translateWord(term)||manualPersian?.trim();
    if(reviewed)return {translation:reviewed.slice(0,250),source:"manual"};
  }
  if(!translationServiceConnected())return {translation:"",source:"unavailable"};
  try{
    const response=await fetch(settings.TRANSLATION_API_URL!,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({q:term,source:"en",target:language,format:"text",...(settings.TRANSLATION_API_KEY?{api_key:settings.TRANSLATION_API_KEY}:{})}),signal:AbortSignal.timeout(7000)});
    if(!response.ok)return {translation:"",source:"unavailable"};
    const data=await response.json() as {translatedText?:unknown};
    return typeof data.translatedText==="string"&&data.translatedText.trim()?{translation:data.translatedText.trim().slice(0,250),source:"provider"}:{translation:"",source:"unavailable"};
  }catch{return {translation:"",source:"unavailable"}}
}

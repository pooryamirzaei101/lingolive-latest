import {and,eq,sql} from 'drizzle-orm';
import {getDb} from '@/db';
import {translationCache,translationUsage} from '@/db/schema';
import {integrationConfig,translateTexts,translationConnected} from '@/lib/media-integrations';
import type {TranslationLanguage} from '@/lib/languages';
export const canonicalText=(text:string)=>text.replace(/\r/g,'').trim();
export async function translationId(text:string,language:string,scope=''){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${scope?`${scope}\n`:''}${language}\n${canonicalText(text)}`));return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}
export async function savedTranslation(text:string,language:TranslationLanguage,scope=''){return getDb().select().from(translationCache).where(eq(translationCache.id,await translationId(text,language,scope))).get()}
export async function saveTranslation(text:string,language:TranslationLanguage,translation:string,source='manual',scope=''){
 const english=canonicalText(text);if(!english||english.length>12000||!translation.trim()||translation.length>24000)throw Error('Enter valid English and translation text.');const row={id:await translationId(english,language,scope),english,language,translation:translation.trim(),source,state:'ready',updatedAt:Date.now()};
 await getDb().insert(translationCache).values(row).onConflictDoUpdate({target:translationCache.id,set:row});return row.translation;
}
export async function cachedTranslation(text:string,language:TranslationLanguage,userId?:string,scope=''):Promise<{translation:string;source:string}>{
 const english=canonicalText(text);if(!english||english.length>12000)throw Error('Text is too long.');const id=await translationId(english,language,scope),db=getDb();let row=await savedTranslation(english,language,scope);
 if(row?.state==='ready')return {translation:row.translation,source:row.source};
 // Provider translations are shared by normalized English text and language.
 // Lesson-scoped rows remain available for administrator corrections, but never
 // cause the same text to consume provider quota again in another lesson.
 if(scope){const shared=await cachedTranslation(english,language,userId);const scoped={id,english,language,translation:shared.translation,source:shared.source,state:'ready',updatedAt:Date.now()};await db.insert(translationCache).values(scoped).onConflictDoNothing();await db.update(translationCache).set({translation:shared.translation,source:shared.source,state:'ready',updatedAt:Date.now()}).where(and(eq(translationCache.id,id),sql`${translationCache.source} != 'manual'`));return shared}
 if(row?.state==='pending'&&Date.now()-row.updatedAt<90000)throw Error('This translation is being prepared. Please try again shortly.');
 const config=await integrationConfig();if(!config.enabled||!translationConnected(config))throw Error('Translation is not available yet. The administrator must connect and enable the translation API.');
 // A database lease prevents simultaneous students from paying for the same translation.
 if(row){const acquired=await db.update(translationCache).set({state:'pending',updatedAt:Math.max(Date.now(),row.updatedAt+1)}).where(and(eq(translationCache.id,id),eq(translationCache.updatedAt,row.updatedAt))).returning();if(!acquired.length)throw Error('Translation is being prepared. Please try again shortly.')}else{const acquired=await db.insert(translationCache).values({id,english,language,state:'pending',updatedAt:Date.now()}).onConflictDoNothing().returning();if(!acquired.length)throw Error('Translation is being prepared. Please try again shortly.')}
 try{
 if(userId){const usageId=`${userId}:${new Date().toISOString().slice(0,10)}`;await db.insert(translationUsage).values({id:usageId}).onConflictDoNothing();const allowed=await db.update(translationUsage).set({count:sql`${translationUsage.count}+1`,characters:sql`${translationUsage.characters}+${english.length}`}).where(and(eq(translationUsage.id,usageId),sql`${translationUsage.count}<200`,sql`${translationUsage.characters}+${english.length}<=60000`)).returning();if(!allowed.length)throw Error('Today’s new translation limit has been reached. Saved translations remain available.')}
 const [translation]=await translateTexts([english],language,config);if(!translation?.trim())throw Error('The provider returned an empty translation.');
 // Do not overwrite a correction saved by an administrator while a request was running.
 await db.update(translationCache).set({translation,source:'provider',state:'ready',updatedAt:Date.now()}).where(and(eq(translationCache.id,id),eq(translationCache.state,'pending')));
 const result=await savedTranslation(english,language,scope);return {translation:result?.translation||translation,source:result?.source||'provider'};
 }catch(e){await db.update(translationCache).set({state:'failed',updatedAt:Date.now()}).where(and(eq(translationCache.id,id),eq(translationCache.state,'pending')));throw e}
}

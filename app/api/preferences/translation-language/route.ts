import {eq} from 'drizzle-orm';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDb} from '@/db';
import {learnerPreferences} from '@/db/schema';
import {isTranslationLanguage} from '@/lib/languages';
export async function POST(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to choose a translation language and save words.'},{status:401});if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});try{const body=await request.json() as {language?:unknown};if(!isTranslationLanguage(body.language))return Response.json({error:'Choose a supported language.'},{status:400});const db=getDb();await db.insert(learnerPreferences).values({userId:user.userId,translationLanguage:body.language}).onConflictDoUpdate({target:learnerPreferences.userId,set:{translationLanguage:body.language}});return Response.json({language:body.language})}catch{return Response.json({error:'Could not save the language.'},{status:500})}}

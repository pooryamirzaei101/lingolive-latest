import {getChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin';
import {isTranslationLanguage} from '@/lib/languages';
import {preferredLanguage} from '@/lib/translation-service';
import {learningSource} from '@/lib/learning-source';
import {cachedTranslation,savedTranslation,saveTranslation} from '@/lib/translation-cache';
import {getDb} from '@/db';
import {videoLessons} from '@/db/schema';
import {eq} from 'drizzle-orm';

const lessonScope=(section:string,id:string,field:string)=>`lesson:${section}:${id}:${field}`;

export async function GET(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to use translations.'},{status:401});
 try{
  const q=new URL(request.url).searchParams,language=q.get('language')||await preferredLanguage(user.userId);
  if(!isTranslationLanguage(language))throw Error('Choose a supported language.');
  const section=q.get('section')||'',id=q.get('id')||'',admin=await isAdmin();
  const fields=await learningSource(section,id,admin),podcast=section==='video'&&(await getDb().select({kind:videoLessons.contentKind}).from(videoLessons).where(eq(videoLessons.id,id)).get())?.kind==='podcast';
  return Response.json({language,fields:await Promise.all(fields.filter(f=>!q.get('field')||f.key===q.get('field')).map(async f=>{
   const cached=await savedTranslation(f.english,language,lessonScope(section,id,f.key));
   // Preserve earlier administrator corrections made before lesson-scoped storage.
   const legacy=cached?null:await savedTranslation(f.english,language);
   const reviewed=cached?.state==='ready'&&cached.source==='manual'?cached:legacy?.state==='ready'&&legacy.source==='manual'?legacy:null;
   const embedded=f.translations?.[language]||(language==='fa'?f.persian:'');
   const available=cached?.state==='ready'&&(admin||section==='ielts'&&(f.key.startsWith('segment-')||f.key==='answer')||podcast&&f.key.startsWith('segment-'))?cached:null;
   return {...f,translation:reviewed?.translation||embedded||available?.translation||'',source:reviewed?'manual':embedded?'lesson':available?.source||'missing'};
  }))});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not load.'},{status:400})}
}
export async function POST(request:Request){return change(request,false)}
export async function PATCH(request:Request){return change(request,true)}
async function change(request:Request,manual:boolean){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to use translations.'},{status:401});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403});
 const admin=await isAdmin();if(manual&&!admin)return Response.json({error:'Only administrators can edit lesson translations.'},{status:403});
 try{
  const body=await request.json() as any,language=body.language||await preferredLanguage(user.userId);
  if(!isTranslationLanguage(language))throw Error('Choose a supported language.');
  const fields=await learningSource(body.section,body.id,admin),field=fields.find(f=>f.key===body.field);
  if(!field)throw Error('Choose a valid text field.');
  const scope=lessonScope(body.section,body.id,field.key);
  if(manual){if(typeof body.translation!=='string')throw Error('Enter translation text.');return Response.json({translation:await saveTranslation(field.english,language,body.translation,'manual',scope),source:'manual',language})}
  const saved=await savedTranslation(field.english,language,scope);
  if(saved?.state==='ready'&&saved.source==='manual')return Response.json({translation:saved.translation,source:'manual',language});
  const legacy=saved?null:await savedTranslation(field.english,language);
  if(legacy?.state==='ready'&&legacy.source==='manual')return Response.json({translation:legacy.translation,source:'manual',language});
  const existing=field.translations?.[language]||(language==='fa'?field.persian:'');
  if(existing)return Response.json({translation:existing,source:'lesson',language});
  const podcast=body.section==='video'&&(await getDb().select({kind:videoLessons.contentKind}).from(videoLessons).where(eq(videoLessons.id,body.id)).get())?.kind==='podcast';
  if(!admin&&!(body.section==='ielts'&&(field.key.startsWith('segment-')||field.key==='answer'))&&!(podcast&&field.key.startsWith('segment-')))return Response.json({error:'This language has not been reviewed for this lesson yet.'},{status:409});
  const result=await cachedTranslation(field.english,language,user.userId,scope);
  return Response.json({...result,language});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Translation is unavailable.'},{status:400})}
}

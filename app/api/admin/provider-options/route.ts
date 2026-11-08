import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {mediaIntegrations} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {encryptKey,assemblyRequest,translateTexts,integrationConfig} from '@/lib/media-integrations';
import {providerOptions,type ProviderConnection} from '@/lib/provider-options';
import {providerUrl} from '@/lib/configurable-providers';
import {isTranslationProvider} from '@/lib/translation-providers';
async function state(){const row=await getDb().select().from(mediaIntegrations).where(eq(mediaIntegrations.id,'main')).get(),options=providerOptions(row?.providerOptions);return {...options,translationProvider:row?.translationProvider||'google',enabled:!!row?.enabled,transcription:{...options.transcription,key:undefined,connected:!!options.transcription.key},translation:{...options.translation,key:undefined,connected:!!options.translation.key}}}
export async function GET(){if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});return Response.json(await state(),{headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 try{
 const text=await request.text();if(text.length>20000)throw Error('Settings request is too large.');const data=JSON.parse(text);
 if(data.action==='test-translation'){await translateTexts(['Hello'],data.language||'fa');return Response.json({ok:true})}
 if(data.action==='test-transcription'){const c=await integrationConfig({assembly:true,translation:false});if(c.transcriptionProvider!=='assembly')throw Error('Test this provider by generating English for a short uploaded draft. A key alone cannot verify timed transcription support.');await assemblyRequest('transcript?limit=1',c.assemblyKey);return Response.json({ok:true})}
 const row=await getDb().select().from(mediaIntegrations).where(eq(mediaIntegrations.id,'main')).get(),previous=providerOptions(row?.providerOptions);
 if(!['assembly','openai','custom'].includes(data.transcriptionProvider)||!isTranslationProvider(data.translationProvider)||typeof data.enabled!=='boolean')throw Error('Choose valid providers and generation settings.');
 async function connection(name:'transcription'|'translation'):Promise<ProviderConnection>{
 const value=data[name],old=previous[name];if(!value||typeof value.endpoint!=='string'||typeof value.model!=='string'||typeof value.key!=='string'||value.model.length>160||value.key.length>2000||/[\r\n]/.test(value.key)||!['Authorization','x-api-key','api-key'].includes(value.authHeader))throw Error('Check the endpoint, model, authentication header, and API key.');
 const endpoint=value.endpoint.trim();if(endpoint)providerUrl(endpoint);
 if(endpoint&&old.endpoint&&new URL(endpoint).origin!==new URL(old.endpoint).origin&&!value.key.trim()&&old.key)throw Error('Re-enter the API key when changing the API website.');
 return {endpoint,model:value.model.trim(),authHeader:value.authHeader,key:value.key.trim()?await encryptKey(value.key.trim()):old.key};
 }
 const transcription=await connection('transcription'),translation=await connection('translation');
 if(data.transcriptionProvider!=='assembly'&&(!transcription.endpoint||!transcription.key))throw Error('Save the transcription endpoint and key.');
 if(data.transcriptionProvider==='openai'&&!transcription.model)throw Error('Enter a transcription model supporting segment timestamps, such as whisper-1.');
 if(['openai','custom'].includes(data.translationProvider)&&(!translation.endpoint||!translation.key))throw Error('Save the translation endpoint and key.');
 if(data.translationProvider==='openai'&&!translation.model)throw Error('Enter the translation model name.');
 const values={providerOptions:JSON.stringify({transcriptionProvider:data.transcriptionProvider,transcription,translation}),translationProvider:data.translationProvider,enabled:data.enabled?1:0};
 await getDb().insert(mediaIntegrations).values({id:'main',...values}).onConflictDoUpdate({target:mediaIntegrations.id,set:values});
 return Response.json(await state(),{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not save providers.'},{status:400})}
}

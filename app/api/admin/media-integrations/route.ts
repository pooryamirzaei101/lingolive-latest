import {youtubeToken} from "@/lib/youtube-captions";
import {eq} from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { getDb } from "@/db";
import { mediaIntegrations } from "@/db/schema";
import { decryptKey, encryptKey, integrationConfig, assemblyRequest, translateTexts, translationConnected } from "@/lib/media-integrations";
import {isTranslationProvider,deeplAccount} from '@/lib/translation-providers';
import {isTranslationLanguage} from '@/lib/languages';
export async function GET(){if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const row=await getDb().select().from(mediaIntegrations).get();return Response.json({assemblyConnected:!!row?.assemblyKey,googleConnected:!!row?.googleKey,deeplConnected:!!row?.deeplKey,azureConnected:!!row?.azureKey,translationProvider:row?.translationProvider||"google",deeplPlan:row?.deeplKey?deeplAccount(await decryptKey(row.deeplKey)):"free",azureRegion:row?.azureRegion||"",enabled:!!row?.enabled,youtubeConfigured:!!row?.youtubeClientId&&!!row?.youtubeClientSecret,youtubeConnected:!!row?.youtubeRefreshToken})}
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
 if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid origin"},{status:403});
 try{const data=await request.json() as any;
 if(data.action==="youtube-save"){const row=await getDb().select().from(mediaIntegrations).get();const youtubeClientId=data.youtubeClientId?await encryptKey(String(data.youtubeClientId).trim()):row?.youtubeClientId||"",youtubeClientSecret=data.youtubeClientSecret?await encryptKey(String(data.youtubeClientSecret).trim()):row?.youtubeClientSecret||"";if(!youtubeClientId||!youtubeClientSecret)throw Error("Enter both OAuth credentials.");const values={youtubeClientId,youtubeClientSecret,...(data.youtubeClientId||data.youtubeClientSecret?{youtubeRefreshToken:""}:{})};await getDb().insert(mediaIntegrations).values({id:"main",...values}).onConflictDoUpdate({target:mediaIntegrations.id,set:values});return Response.json({ok:true})}
 if(data.action==="youtube-disconnect"){await getDb().update(mediaIntegrations).set({youtubeRefreshToken:""}).where(eq(mediaIntegrations.id,"main"));return Response.json({ok:true})}
 if(data.action==="youtube-test"){await youtubeToken();return Response.json({ok:true})}
 if(data.action==="test"){const c=await integrationConfig();if(data.provider==="assembly"){if(!c.assemblyKey)throw new Error("Save an AssemblyAI key first.");await assemblyRequest("transcript?limit=1",c.assemblyKey)}else{if(!isTranslationProvider(data.provider))throw Error("Choose a valid provider to test.");const language=data.language??"es";if(!isTranslationLanguage(language))throw Error("Choose a valid test language.");await translateTexts(["Hello"],language,{...c,translationProvider:data.provider})}return Response.json({ok:true})}
 if(data.action&&data.action!=="save")throw Error("Choose a valid action.");
 const current=await getDb().select().from(mediaIntegrations).get();
 const provider=data.translationProvider??current?.translationProvider??"google";if(!isTranslationProvider(provider))throw Error("Choose a valid translation provider.");if(data.enabled!==undefined&&typeof data.enabled!=="boolean")throw Error("Choose whether to enable processing.");
 async function secret(field:'assemblyKey'|'googleKey'|'deeplKey'|'azureKey'){const value=data[field];if(value!==undefined&&(typeof value!=="string"||value.length>500||/[\r\n]/.test(value)))throw Error("Enter a valid API key of up to 500 characters.");return value?.trim()?await encryptKey(value.trim()):current?.[field]||""}
 const assemblyKey=await secret('assemblyKey'),googleKey=await secret('googleKey'),deeplKey=await secret('deeplKey'),azureKey=await secret('azureKey'),deeplPlan=data.deeplPlan??current?.deeplPlan??"free",azureRegion=data.azureRegion??current?.azureRegion??"";
 if(!['free','pro'].includes(deeplPlan))throw Error("Choose DeepL API Free or Pro.");if(typeof azureRegion!=="string"||azureRegion.length>60||!/^[a-z0-9-]*$/.test(azureRegion))throw Error("Enter an Azure region such as westeurope, or global.");
 const enabled=data.enabled===undefined?current?.enabled||0:data.enabled?1:0;
 if(enabled&&!assemblyKey&&!translationConnected({translationProvider:provider,googleKey,deeplKey,deeplPlan,azureKey,azureRegion}))throw Error("Save AssemblyAI or selected translation provider credentials before enabling processing.");
 const values={assemblyKey,googleKey,deeplKey,deeplPlan,azureKey,azureRegion,translationProvider:provider,enabled};await getDb().insert(mediaIntegrations).values({id:"main",...values}).onConflictDoUpdate({target:mediaIntegrations.id,set:values});return Response.json({ok:true});
 }catch(e){return Response.json({error:e instanceof Error?e.message:"Could not save API settings."},{status:400})}
}

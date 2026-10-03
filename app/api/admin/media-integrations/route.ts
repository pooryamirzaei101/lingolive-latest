import {youtubeToken} from "@/lib/youtube-captions";
import {eq} from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { getDb } from "@/db";
import { mediaIntegrations } from "@/db/schema";
import { encryptKey, integrationConfig, assemblyRequest, googleTranslate } from "@/lib/media-integrations";
export async function GET(){if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const row=await getDb().select().from(mediaIntegrations).get();return Response.json({assemblyConnected:!!row?.assemblyKey,googleConnected:!!row?.googleKey,enabled:!!row?.enabled,youtubeConfigured:!!row?.youtubeClientId&&!!row?.youtubeClientSecret,youtubeConnected:!!row?.youtubeRefreshToken})}
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
 if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid origin"},{status:403});
 try{const data=await request.json() as any;
 if(data.action==="youtube-save"){const row=await getDb().select().from(mediaIntegrations).get();const youtubeClientId=data.youtubeClientId?await encryptKey(String(data.youtubeClientId).trim()):row?.youtubeClientId||"",youtubeClientSecret=data.youtubeClientSecret?await encryptKey(String(data.youtubeClientSecret).trim()):row?.youtubeClientSecret||"";if(!youtubeClientId||!youtubeClientSecret)throw Error("Enter both OAuth credentials.");const values={youtubeClientId,youtubeClientSecret,...(data.youtubeClientId||data.youtubeClientSecret?{youtubeRefreshToken:""}:{})};await getDb().insert(mediaIntegrations).values({id:"main",...values}).onConflictDoUpdate({target:mediaIntegrations.id,set:values});return Response.json({ok:true})}
 if(data.action==="youtube-disconnect"){await getDb().update(mediaIntegrations).set({youtubeRefreshToken:""}).where(eq(mediaIntegrations.id,"main"));return Response.json({ok:true})}
 if(data.action==="youtube-test"){await youtubeToken();return Response.json({ok:true})}
 if(data.action==="test"){const c=await integrationConfig();if(data.provider==="assembly"){if(!c.assemblyKey)throw new Error("Save an AssemblyAI key first.");await assemblyRequest("transcript?limit=1",c.assemblyKey)}else{if(!c.googleKey)throw new Error("Save a Google Cloud Translation key first.");await googleTranslate(["Hello"],"es",c.googleKey)}return Response.json({ok:true})}
 const current=await getDb().select().from(mediaIntegrations).get();const assemblyKey=data.assemblyKey?await encryptKey(String(data.assemblyKey).trim()):current?.assemblyKey||"",googleKey=data.googleKey?await encryptKey(String(data.googleKey).trim()):current?.googleKey||"";
 if(data.enabled&&!googleKey&&!assemblyKey)throw new Error("Save an AssemblyAI or translation API key before enabling processing.");
 await getDb().insert(mediaIntegrations).values({id:"main",assemblyKey,googleKey,enabled:data.enabled?1:0}).onConflictDoUpdate({target:mediaIntegrations.id,set:{assemblyKey,googleKey,enabled:data.enabled?1:0}});return Response.json({ok:true});
 }catch(e){return Response.json({error:e instanceof Error?e.message:"Could not save API settings."},{status:400})}
}

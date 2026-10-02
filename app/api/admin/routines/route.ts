import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { routineLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

const audioTypes=new Set(["audio/mpeg","audio/mp4","audio/wav","audio/ogg","audio/webm"]);
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid request origin"},{status:403});
  let newKey:string|undefined;
  try{
    const form=await request.formData();
    const rawId=String(form.get("id")||""),id=rawId||crypto.randomUUID();
    if(rawId&&rawId!=="morning-routine"&&!/^[0-9a-f-]{36}$/i.test(rawId))return Response.json({error:"Invalid lesson"},{status:400});
    const title=String(form.get("title")||"").trim().slice(0,160),phrase=String(form.get("phrase")||"").trim().slice(0,120),phraseTranslation=String(form.get("phraseTranslation")||"").trim().slice(0,250),explanation=String(form.get("explanation")||"").trim().slice(0,1200),exampleOne=String(form.get("exampleOne")||"").trim().slice(0,350),exampleOneTranslation=String(form.get("exampleOneTranslation")||"").trim().slice(0,350),exampleTwo=String(form.get("exampleTwo")||"").trim().slice(0,350),exampleTwoTranslation=String(form.get("exampleTwoTranslation")||"").trim().slice(0,350),body=String(form.get("body")||"").trim().slice(0,4000),status=String(form.get("status")||"draft");
    if(!title||!phrase||!explanation||!exampleOne||!exampleTwo||!body||!(["draft","published"] as string[]).includes(status))return Response.json({error:"Add a title, phrase, explanation, two examples, and lesson text."},{status:400});
    const file=form.get("audio");
    if(file instanceof File&&file.size){if(!audioTypes.has(file.type)||file.size>10*1024*1024)return Response.json({error:"Upload MP3, M4A, WAV, OGG, or WebM audio under 10 MB."},{status:400});newKey=`routines/${id}/${crypto.randomUUID()}`;await getMediaBucket().put(newKey,file.stream(),{httpMetadata:{contentType:file.type}})}
    const db=getDb(),existing=await db.select().from(routineLessons).where(eq(routineLessons.id,id)).get();
    const values={title,phrase,phraseTranslation,explanation,exampleOne,exampleOneTranslation,exampleTwo,exampleTwoTranslation,body,status,audioKey:newKey||existing?.audioKey||null,mimeType:newKey?(file as File).type:existing?.mimeType||null};
    if(existing)await db.update(routineLessons).set(values).where(eq(routineLessons.id,id));
    else await db.insert(routineLessons).values({id,...values,createdAt:Date.now()});
    if(newKey&&existing?.audioKey)await getMediaBucket().delete(existing.audioKey).catch(()=>{});
    return Response.json({id,status,saved:true});
  }catch{if(newKey)await getMediaBucket().delete(newKey).catch(()=>{});return Response.json({error:"Could not save this routine lesson."},{status:500})}
}

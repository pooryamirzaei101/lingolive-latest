import {and,asc,eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {ieltsBlocks,ieltsSpeakingExamples} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {stagedMedia} from '@/lib/admin-media';
async function lesson(id:string){return getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get()}
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});const {id}=await params;if(!await lesson(id))return Response.json({error:'Lesson not found'},{status:404});return Response.json({blocks:await getDb().select().from(ieltsBlocks).where(eq(ieltsBlocks.lessonId,id)).orderBy(asc(ieltsBlocks.position)).all()})}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});const {id}=await params,current=await lesson(id);if(!current||current.kind==='speaking_video')return Response.json({error:'Reading lesson not found'},{status:404});
 try{const form=await request.formData(),kind=String(form.get('kind')||''),body=String(form.get('body')||'').trim();if(!['text','table','image','audio'].includes(kind)||body.length>30000||['text','table'].includes(kind)&&!body)return Response.json({error:'Add a text, table, image, or audio block.'},{status:400});
  let mediaKey:string|null=null,mimeType:string|null=null;
  if(kind==='audio'){const staged=await stagedMedia(String(form.get('uploadKey')||''),'audio');if(!staged)return Response.json({error:'Upload supported audio up to 100 MB.'},{status:400});mediaKey=staged.key;mimeType=staged.mimeType}
  if(kind==='image'){const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>5_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type))return Response.json({error:'Choose a JPG, PNG, or WebP image under 5 MB.'},{status:400});const bytes=new Uint8Array(await file.arrayBuffer()),png=bytes.slice(0,4).every((v,i)=>v===[137,80,78,71][i]),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';if(!png&&!jpeg&&!webp)return Response.json({error:'The image file is invalid.'},{status:400});mediaKey=`ielts-blocks/${id}/${crypto.randomUUID()}`;mimeType=file.type;await getMediaBucket().put(mediaKey,bytes,{httpMetadata:{contentType:mimeType}})}
  const rows=await getDb().select().from(ieltsBlocks).where(eq(ieltsBlocks.lessonId,id)).orderBy(asc(ieltsBlocks.position)).all(),block={id:crypto.randomUUID(),lessonId:id,position:(rows.at(-1)?.position||0)+1,kind,body,mediaKey,mimeType,createdAt:Date.now()};
  try{await getDb().insert(ieltsBlocks).values(block);await getDb().update(ieltsSpeakingExamples).set({status:'draft'}).where(eq(ieltsSpeakingExamples.id,id))}catch(error){if(mediaKey)await getMediaBucket().delete(mediaKey);throw error}return Response.json({block},{status:201});
 }catch{return Response.json({error:'Could not save the content block.'},{status:500})}
}

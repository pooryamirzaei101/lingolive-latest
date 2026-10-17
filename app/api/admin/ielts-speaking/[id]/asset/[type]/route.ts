import {eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {ieltsSpeakingExamples} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {stagedMedia} from '@/lib/admin-media';

export async function POST(request:Request,{params}:{params:Promise<{id:string;type:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id,type}=await params;if(type!=='pdf'&&type!=='thumbnail')return Response.json({error:'Invalid attachment'},{status:400});
 const db=getDb(),row=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!row)return Response.json({error:'Lesson not found'},{status:404});
 try{
  const form=await request.formData();let key:string,oldKey=type==='pdf'?row.pdfKey:row.thumbnailKey;
  if(type==='pdf'){
   const staged=await stagedMedia(String(form.get('uploadKey')||''),'document');if(!staged)return Response.json({error:'Upload a valid PDF up to 100 MB.'},{status:400});key=staged.key;
  }else{
   const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>8_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type))return Response.json({error:'Choose a JPG, PNG, or WebP image up to 8 MB.'},{status:400});
   const bytes=new Uint8Array(await file.arrayBuffer()),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,png=bytes.slice(0,4).every((v,i)=>v===[137,80,78,71][i]),webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
   if(!jpeg&&!png&&!webp)return Response.json({error:'The image file is invalid.'},{status:400});
   key=`ielts-thumbnails/${id}/${crypto.randomUUID()}`;await getMediaBucket().put(key,bytes,{httpMetadata:{contentType:file.type}});
  }
  try{await db.update(ieltsSpeakingExamples).set(type==='pdf'?{pdfKey:key,status:'draft'}:{thumbnailKey:key}).where(eq(ieltsSpeakingExamples.id,id))}catch(error){await getMediaBucket().delete(key);throw error}
  if(oldKey&&oldKey!==key)await getMediaBucket().delete(oldKey).catch(()=>{});
  return Response.json({saved:true});
 }catch{return Response.json({error:'Could not save the attachment. Try again.'},{status:500})}
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string;type:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id,type}=await params;if(type!=='pdf'&&type!=='thumbnail')return Response.json({error:'Invalid attachment'},{status:400});
 const db=getDb(),row=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!row)return Response.json({error:'Lesson not found'},{status:404});
 const key=type==='pdf'?row.pdfKey:row.thumbnailKey;
 await db.update(ieltsSpeakingExamples).set(type==='pdf'?{pdfKey:null,status:'draft'}:{thumbnailKey:null}).where(eq(ieltsSpeakingExamples.id,id));if(key)await getMediaBucket().delete(key).catch(()=>{});return Response.json({deleted:true});
}

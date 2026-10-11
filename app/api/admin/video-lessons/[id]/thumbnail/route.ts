import {eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {videoLessons} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {parseThumbnailSettings} from '@/lib/thumbnails';

const allowed:Record<string,number[]>={'image/jpeg':[0xff,0xd8,0xff],'image/png':[0x89,0x50,0x4e,0x47],'image/webp':[0x52,0x49,0x46,0x46]};
async function lessonFor(id:string){return getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get()}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id}=await params,lesson=await lessonFor(id);if(!lesson)return Response.json({error:'Lesson not found'},{status:404});
 try{
  const form=await request.formData(),file=form.get('image'),source=form.get('source')==='generated'?'generated':'custom';
  if(!(file instanceof File)||!file.size||file.size>8_000_000||!allowed[file.type])return Response.json({error:'Choose a JPG, PNG, or WebP image up to 8 MB.'},{status:400});
  const bytes=new Uint8Array(await file.arrayBuffer()),signature=allowed[file.type];
  if(!signature.every((byte,index)=>bytes[index]===byte)||(file.type==='image/webp'&&String.fromCharCode(...bytes.slice(8,12))!=='WEBP'))return Response.json({error:'The image file does not match its format.'},{status:400});
  const key=`thumbnails/${id}/${crypto.randomUUID()}`,settings=parseThumbnailSettings(String(form.get('settings')||''));
  await getMediaBucket().put(key,bytes,{httpMetadata:{contentType:file.type,cacheControl:'public, max-age=31536000, immutable'}});
  try{await getDb().update(videoLessons).set({thumbnailKey:key,thumbnailSource:source,thumbnailSettings:JSON.stringify(settings)}).where(eq(videoLessons.id,id))}catch(error){await getMediaBucket().delete(key);throw error}
  if(lesson.thumbnailKey)await getMediaBucket().delete(lesson.thumbnailKey).catch(()=>{});
  return Response.json({ok:true,source});
 }catch{return Response.json({error:'Could not save this thumbnail.'},{status:500})}
}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id}=await params,lesson=await lessonFor(id);if(!lesson)return Response.json({error:'Lesson not found'},{status:404});
 const settings=parseThumbnailSettings(JSON.stringify(await request.json()));await getDb().update(videoLessons).set({thumbnailSettings:JSON.stringify(settings)}).where(eq(videoLessons.id,id));return Response.json({ok:true});
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:'Not authorized'},{status:403});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const {id}=await params,lesson=await lessonFor(id);if(!lesson)return Response.json({error:'Lesson not found'},{status:404});
 await getDb().update(videoLessons).set({thumbnailKey:null,thumbnailSource:'default'}).where(eq(videoLessons.id,id));if(lesson.thumbnailKey)await getMediaBucket().delete(lesson.thumbnailKey).catch(()=>{});return Response.json({ok:true});
}

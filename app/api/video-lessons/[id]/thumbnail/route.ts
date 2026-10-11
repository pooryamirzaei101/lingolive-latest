import {eq} from 'drizzle-orm';
import {getDb,getMediaBucket} from '@/db';
import {videoLessons} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params,lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();
 if(!lesson||!lesson.thumbnailKey||(lesson.status!=='published'&&!await isAdmin()))return new Response('Not found',{status:404});
 const object=await getMediaBucket().get(lesson.thumbnailKey);if(!object)return new Response('Not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'image/jpeg','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
}

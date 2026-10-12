import {and,desc,eq} from "drizzle-orm";
import {getDb,getMediaBucket} from "@/db";
import {readingBlocks,readingChapters} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {stagedMedia} from "@/lib/admin-media";
const imageTypes=new Set(["image/jpeg","image/png","image/webp","image/gif"]);
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id:chapterId}=await params;
 try{const chapter=await getDb().select({id:readingChapters.id}).from(readingChapters).where(eq(readingChapters.id,chapterId)).get();if(!chapter)return Response.json({error:"Unit not found"},{status:404});
  const form=await request.formData(),kind=String(form.get("kind")||""),body=String(form.get("body")||"").trim(),file=form.get("file"),uploadKey=String(form.get("uploadKey")||"");
  if(!["text","image","pdf","audio"].includes(kind))return Response.json({error:"Choose text, a slide/image, a PDF, or voice."},{status:400});
  if(kind==="text"&&(!body||body.length>50000))return Response.json({error:"Enter text up to 50,000 characters."},{status:400});
  if(kind!=="text"&&body.length>300)return Response.json({error:"Caption is too long."},{status:400});
  let key:string|null=null,mimeType:string|null=null;
  if(kind==="audio"){
   const staged=await stagedMedia(uploadKey,"audio");if(!staged)return Response.json({error:"Upload a supported audio file up to 100 MB."},{status:400});key=staged.key;mimeType=staged.mimeType;
  }else if(kind==="pdf"){
   const staged=await stagedMedia(uploadKey,"document");if(!staged)return Response.json({error:"Upload a PDF up to 100 MB."},{status:400});key=staged.key;mimeType=staged.mimeType;
  }else if(kind==="image"){
   if(!(file instanceof File)||!file.size||file.size>15*1024*1024||!imageTypes.has(file.type))return Response.json({error:"Choose a JPG, PNG, WebP, or GIF image up to 15 MB."},{status:400});
   key=`reading-blocks/${chapterId}/${crypto.randomUUID()}`;mimeType=file.type;await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:mimeType}});
  }
  const previous=await getDb().select({position:readingBlocks.position}).from(readingBlocks).where(eq(readingBlocks.chapterId,chapterId)).orderBy(desc(readingBlocks.position)).get(),id=crypto.randomUUID();
  try{await getDb().insert(readingBlocks).values({id,chapterId,position:(previous?.position||0)+1,kind,body,mediaKey:key,mimeType,createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key).catch(()=>{});throw error}
  return Response.json({id},{status:201});
 }catch{return Response.json({error:"Could not add this content block."},{status:500})}
}

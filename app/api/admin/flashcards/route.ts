import {getDb} from "@/db";
import {quickTipLessons} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {stagedMedia} from "@/lib/admin-media";
import {FLASHCARD_CATEGORY} from "@/lib/flashcards";
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
 try{const form=await request.formData(),title=String(form.get("title")||"").trim(),body=String(form.get("body")||"").trim(),example=String(form.get("example")||"").trim(),uploadKey=String(form.get("uploadKey")||""),audio=uploadKey?await stagedMedia(uploadKey,"audio"):null;
  if(!title||title.length>120||body.length>2000||example.length>1000||(!body&&!example))return Response.json({error:"Add a phrase and at least one example or explanation."},{status:400});
  if(uploadKey&&!audio)return Response.json({error:"Upload a supported audio file up to 100 MB."},{status:400});
  const id=crypto.randomUUID();await getDb().insert(quickTipLessons).values({id,category:FLASHCARD_CATEGORY,title,body,example,translation:"",exampleTranslation:"",audioKey:audio?.key||null,mimeType:audio?.mimeType||null,status:"draft",createdAt:Date.now()});return Response.json({id,status:"draft"},{status:201});
 }catch{return Response.json({error:"Could not save the flashcard."},{status:500})}
}

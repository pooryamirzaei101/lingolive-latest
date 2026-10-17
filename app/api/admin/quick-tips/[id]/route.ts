import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  const {id}=await params;
  try{
    const current=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!current)return Response.json({error:"Tip not found"},{status:404});
    const input=await request.json() as Partial<{category:string;title:string;body:string;translation:string;example:string;exampleTranslation:string;status:string}>;
    const category=input.category??current.category,title=(input.title??current.title).trim(),body=(input.body??current.body).trim(),translation=(input.translation??current.translation).trim(),example=(input.example??current.example).trim(),exampleTranslation=(input.exampleTranslation??current.exampleTranslation).trim(),status=input.status??current.status;
    if(!(await getVideoCategories("tips")).some(item=>item.id===category)||!title||title.length>160||!body||body.length>3000||translation.length>3000||example.length>1000||exampleTranslation.length>1000||!["draft","published"].includes(status))return Response.json({error:"Check the folder, title, text, and publication status."},{status:400});
    if(status==="published"&&!current.audioKey)return Response.json({error:"Add lesson audio before publishing."},{status:400});
    await getDb().update(quickTipLessons).set({category,title,body,translation,example,exampleTranslation,status}).where(eq(quickTipLessons.id,id));return Response.json({id,status});
  }catch{return Response.json({error:"Could not update the tip."},{status:500})}
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id}=await params;
  try{const current=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!current)return Response.json({error:"Tip not found"},{status:404});await getDb().delete(quickTipLessons).where(eq(quickTipLessons.id,id));if(current.audioKey)await getMediaBucket().delete(current.audioKey);return Response.json({deleted:true})}catch{return Response.json({error:"Could not delete the tip."},{status:500})}
}

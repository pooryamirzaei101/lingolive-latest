import { getDb } from "@/db";
import { readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const data=await request.json() as {title?:string;description?:string;category?:string;level?:string};const title=data.title?.trim()||"",category=data.category||"";
    if(!title||title.length>160||!(await getVideoCategories("reading")).some(c=>c.id===category))return Response.json({error:"Enter a title and choose a Reading Room category."},{status:400});
    const id=crypto.randomUUID();await getDb().insert(readingItems).values({id,title,description:(data.description||"").trim().slice(0,1200),category,level:["Beginner","Intermediate","Advanced"].includes(data.level||"")?data.level!:"Beginner",createdAt:Date.now()});return Response.json({id},{status:201});
  }catch{return Response.json({error:"Could not create the reading lesson."},{status:500})}
}

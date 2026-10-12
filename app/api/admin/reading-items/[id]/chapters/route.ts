import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { readingChapters, readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});const {id:itemId}=await params;
  try{const item=await getDb().select().from(readingItems).where(eq(readingItems.id,itemId)).get();if(!item)return Response.json({error:"Reading lesson not found"},{status:404});const data=await request.json() as {title?:string;body?:string;translation?:string},title=data.title?.trim()||"",body=data.body?.trim()||"",translation=data.translation?.trim()||"";
    if(!title||title.length>120||body.length>50000||translation.length>50000)return Response.json({error:"Add a unit title. Text can be added now or as a content block later."},{status:400});const last=await getDb().select({position:readingChapters.position}).from(readingChapters).where(eq(readingChapters.itemId,itemId)).orderBy(desc(readingChapters.position)).get();const id=crypto.randomUUID();await getDb().insert(readingChapters).values({id,itemId,position:(last?.position||0)+1,title,body,translation,createdAt:Date.now()});return Response.json({id},{status:201});
  }catch{return Response.json({error:"Could not add the chapter."},{status:500})}
}

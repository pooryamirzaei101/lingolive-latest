import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoCategories } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { categorySlug, DEFAULT_VIDEO_CATEGORIES } from "@/lib/video";
const invalid=(message:string)=>Response.json({error:message},{status:400});

export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const data=await request.json() as {name?:string};const name=data.name?.trim()||"",id=categorySlug(name);
    if(name.length<2||name.length>60||!id)return invalid("Enter a category name between 2 and 60 characters using letters or numbers.");
    const categories=await getVideoCategories();if(categories.some(c=>c.id===id||c.name.toLowerCase()===name.toLowerCase()))return invalid("This category already exists.");
    await getDb().insert(videoCategories).values({id,name,createdAt:Date.now()});return Response.json({id,name},{status:201});
  }catch{return Response.json({error:"Could not add the category."},{status:500})}
}

export async function PATCH(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const data=await request.json() as {id?:string;name?:string},id=data.id||"",name=data.name?.trim()||"";
    if(name.length<2||name.length>60)return invalid("Enter a category name between 2 and 60 characters.");
    const categories=await getVideoCategories();if(!categories.some(c=>c.id===id))return invalid("Category not found.");
    if(categories.some(c=>c.id!==id&&c.name.toLowerCase()===name.toLowerCase()))return invalid("A category already has that name.");
    const existing=await getDb().select().from(videoCategories).where(eq(videoCategories.id,id)).get();
    if(existing)await getDb().update(videoCategories).set({name}).where(eq(videoCategories.id,id));
    else if(DEFAULT_VIDEO_CATEGORIES.some(c=>c.id===id))await getDb().insert(videoCategories).values({id,name,createdAt:Date.now()});
    return Response.json({id,name});
  }catch{return Response.json({error:"Could not rename the category."},{status:500})}
}

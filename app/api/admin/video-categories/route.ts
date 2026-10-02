import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoCategories } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { categorySlug, DEFAULT_CATEGORIES, type ContentSection } from "@/lib/video";
const invalid=(message:string)=>Response.json({error:message},{status:400});
const validSection=(section:unknown):section is ContentSection=>typeof section==="string"&&Object.hasOwn(DEFAULT_CATEGORIES,section);

export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const data=await request.json() as {name?:string;section?:ContentSection;parentId?:string|null};const name=data.name?.trim()||"",section=data.section,parentId=data.parentId||null;
    if(name.length<2||name.length>60||!categorySlug(name)||!validSection(section))return invalid("Enter a category name between 2 and 60 characters and choose a section.");
    const categories=await getVideoCategories(section!);if(parentId&&!categories.some(c=>c.id===parentId))return invalid("Choose an existing parent folder.");
    if(categories.some(c=>c.parentId===parentId&&c.name.toLowerCase()===name.toLowerCase()))return invalid("This folder already has that category name.");
    const id=`${section}-${categorySlug(name)}-${crypto.randomUUID().slice(0,8)}`;
    await getDb().insert(videoCategories).values({id,name,section:section!,parentId,createdAt:Date.now()});return Response.json({id,name},{status:201});
  }catch{return Response.json({error:"Could not add the category."},{status:500})}
}

export async function PATCH(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const data=await request.json() as {id?:string;name?:string;section?:ContentSection},id=data.id||"",name=data.name?.trim()||"",section=data.section;
    if(name.length<2||name.length>60)return invalid("Enter a category name between 2 and 60 characters.");
    if(!validSection(section))return invalid("Choose a section.");
    const categories=await getVideoCategories(section),current=categories.find(c=>c.id===id);if(!current)return invalid("Category not found.");
    if(categories.some(c=>c.id!==id&&c.parentId===current.parentId&&c.name.toLowerCase()===name.toLowerCase()))return invalid("A folder already has that name.");
    const existing=await getDb().select().from(videoCategories).where(eq(videoCategories.id,id)).get();
    if(existing)await getDb().update(videoCategories).set({name}).where(eq(videoCategories.id,id));
    else if(DEFAULT_CATEGORIES[section].some(c=>c.id===id))await getDb().insert(videoCategories).values({id,name,section,parentId:current.parentId,createdAt:Date.now()});
    return Response.json({id,name});
  }catch{return Response.json({error:"Could not rename the category."},{status:500})}
}

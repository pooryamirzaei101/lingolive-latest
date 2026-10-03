import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoCategories, videoLessons, readingItems, ieltsSpeakingExamples, quickTipLessons, routineLessons } from "@/db/schema";
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

export async function DELETE(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const data=await request.json() as {id?:string;section?:ContentSection};
    if(!validSection(data.section)||!data.id)return invalid("Choose a folder to delete.");
    const categories=await getVideoCategories(data.section),folder=categories.find(item=>item.id===data.id);
    if(!folder)return invalid("Folder not found.");
    if(DEFAULT_CATEGORIES[data.section].some(item=>item.id===data.id))return invalid("Built-in folders can be renamed, but cannot be deleted.");
    if(categories.some(item=>item.parentId===data.id))return invalid("Move or delete its subfolders first.");
    const db=getDb();
    const [videos,reading,ielts,tips,routines]=await Promise.all([
      db.select({id:videoLessons.id}).from(videoLessons).where(eq(videoLessons.category,data.id)).get(),
      db.select({id:readingItems.id}).from(readingItems).where(eq(readingItems.category,data.id)).get(),
      db.select({id:ieltsSpeakingExamples.id}).from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.category,data.id)).get(),
      db.select({id:quickTipLessons.id}).from(quickTipLessons).where(eq(quickTipLessons.category,data.id)).get(),
      db.select({id:routineLessons.id}).from(routineLessons).where(eq(routineLessons.category,data.id)).get(),
    ]);
    if(videos||reading||ielts||tips||routines)return invalid("Move or delete the lessons in this folder first.");
    await db.delete(videoCategories).where(eq(videoCategories.id,data.id));
    return Response.json({deleted:true});
  }catch{return Response.json({error:"Could not delete the folder."},{status:500})}
}

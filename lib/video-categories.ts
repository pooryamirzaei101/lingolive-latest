import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { videoCategories } from "@/db/schema";
import { DEFAULT_CATEGORIES, type ContentSection, type VideoCategory } from "@/lib/video";
export async function getVideoCategories(section:ContentSection="video"):Promise<VideoCategory[]>{
  const saved=await getDb().select().from(videoCategories).orderBy(asc(videoCategories.createdAt)).all();
  const lookup=new Map(saved.map(row=>[row.id,row]));
  const defaults=DEFAULT_CATEGORIES[section];
  return [...defaults.map(item=>({id:item.id,name:lookup.get(item.id)?.name||item.name,section,parentId:"parentId" in item?item.parentId:null,legacy:item.legacy})),...saved.filter(row=>row.section===section&&!defaults.some(item=>item.id===row.id)).map(row=>({id:row.id,name:row.name,section,parentId:row.parentId}))];
}

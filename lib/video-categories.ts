import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { videoCategories } from "@/db/schema";
import { DEFAULT_VIDEO_CATEGORIES, type VideoCategory } from "@/lib/video";
export async function getVideoCategories():Promise<VideoCategory[]>{
  const saved=await getDb().select().from(videoCategories).orderBy(asc(videoCategories.createdAt)).all();
  const lookup=new Map(saved.map(row=>[row.id,row]));
  return [...DEFAULT_VIDEO_CATEGORIES.map(item=>({id:item.id,name:lookup.get(item.id)?.name||item.name,legacy:item.legacy})),...saved.filter(row=>!DEFAULT_VIDEO_CATEGORIES.some(item=>item.id===row.id)).map(row=>({id:row.id,name:row.name}))];
}

import { BookOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import type { VideoCategory } from "@/lib/video";
export const dynamic="force-dynamic";
export default async function ReadingRoom(){let categories:VideoCategory[]=[];let unavailable=false;try{categories=await getVideoCategories("reading")}catch{unavailable=true}
  return <section className="section shell catalog-page"><span className="section-eyebrow">READING ROOM</span><h1>Find a story to read</h1><p>Choose a shelf, then open a text lesson and move through its units.</p>{unavailable?<p className="notice">The reading shelves are temporarily unavailable. Please try again.</p>:<div className="video-folder-grid">{categories.filter(c=>!c.parentId).map(category=><a className="video-folder-card" href={`/reading-room/categories/${category.id}`} key={category.id}><span className="folder-icon"><BookOpen size={27}/></span><h2>{category.name}</h2><span className="folder-open">Open shelf</span></a>)}</div>}</section>}

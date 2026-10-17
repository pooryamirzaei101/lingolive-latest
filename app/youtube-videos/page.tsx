import {FolderOpen,SquarePlay} from "lucide-react";
import {getVideoCategories} from "@/lib/video-categories";
import type {VideoCategory} from "@/lib/video";
export const dynamic="force-dynamic";

export default async function YouTubeLessons(){
  let categories:VideoCategory[]=[];let unavailable=false;
  try{categories=await getVideoCategories("youtube")}catch{unavailable=true}
  return <section className="section shell catalog-page"><span className="section-eyebrow">YOUTUBE LESSONS</span><h1>Learn with YouTube videos</h1><p>Choose a folder, watch the embedded video, and follow synchronized English and translated subtitles. Tap words to save them to your Word Bank, or save complete sentences to My Collection.</p><div className="folder-help"><SquarePlay size={22}/><div><strong>Your language, your lesson</strong><p>Select your translation language inside any lesson. English and translation subtitles can be shown separately or together.</p></div></div>{unavailable?<p className="notice">The YouTube folders are temporarily unavailable. Please try again.</p>:<div className="video-folder-grid">{categories.filter(category=>!category.parentId).map((category,index)=><a className="video-folder-card" href={`/youtube-videos/categories/${category.id}`} key={category.id}><span className="folder-icon"><FolderOpen size={27}/></span><span className="folder-number">{String(index+1).padStart(2,"0")}</span><h2>{category.name}</h2><span className="folder-open">Open folder</span></a>)}</div>}</section>;
}

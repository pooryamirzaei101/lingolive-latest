import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import { learningSections, type LearningSectionSlug } from "@/lib/section-folders";
import { lessons } from "@/lib/content";

export async function SectionFolderCatalog({slug}:{slug:LearningSectionSlug}){
  const config=learningSections[slug],sample=lessons.find(lesson=>lesson.slug===config.sample);
  let categories:Awaited<ReturnType<typeof getVideoCategories>>=[];
  let unavailable=false;
  try{categories=await getVideoCategories(config.section)}catch{unavailable=true}
  return <section className="section shell catalog-page">
    <span className="section-eyebrow">{config.title.toUpperCase()}</span>
    <h1>Choose a folder</h1><p>{config.description}</p>
    {unavailable?<p className="notice">Folders are temporarily unavailable. Please try again later.</p>:<div className="video-folder-grid">{categories.filter(category=>!category.parentId).map(category=><Link className="video-folder-card" href={`/${slug}/categories/${category.id}`} key={category.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{category.name}</h2><span className="folder-open">Open folder</span></Link>)}</div>}
    {sample&&<div className="folder-help"><FolderOpen size={22}/><div><strong>Try a short example</strong><p>{sample.title} · {sample.description}</p></div><Link className="button secondary" href={`/lessons/${sample.slug}`}>Open sample</Link></div>}
    {slug==="youtube-videos"&&<p className="notice">The sample is original text practice. No YouTube video is attached.</p>}
  </section>
}

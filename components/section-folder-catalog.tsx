import { FolderOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import { learningSections, type LearningSectionSlug } from "@/lib/section-folders";
import { lessons } from "@/lib/content";
import { isSampleHidden } from "@/lib/sample-visibility";

export async function SectionFolderCatalog({slug}:{slug:LearningSectionSlug}){
  const config=learningSections[slug],candidate=lessons.find(lesson=>lesson.slug===config.sample);
  const sample=candidate&&!await isSampleHidden(slug==="ielts-examples"?"sample-reading":slug==="quick-tips"?"tip-polite-requests":candidate.slug)?candidate:undefined;
  let categories:Awaited<ReturnType<typeof getVideoCategories>>=[];
  let unavailable=false;
  try{categories=await getVideoCategories(config.section)}catch{unavailable=true}
  return <section className="section shell catalog-page">
    <span className="section-eyebrow">{config.title.toUpperCase()}</span>
    <h1>Choose a folder</h1><p>{config.description}</p>
    {unavailable?<p className="notice">Folders are temporarily unavailable. Please try again later.</p>:<div className="video-folder-grid">{categories.filter(category=>!category.parentId).map(category=><a className="video-folder-card" href={`/${slug}/categories/${category.id}`} aria-label={`Open ${category.name} folder`} key={category.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{category.name}</h2><span className="folder-open">Open folder</span></a>)}</div>}
    {sample&&<div className="folder-help"><FolderOpen size={22}/><div><strong>Try a short example</strong><p>{slug==="ielts-examples"?"Read a library notice and answer two IELTS-style questions.":`${sample.title} · ${sample.description}`}</p></div><a className="button secondary" href={slug==="ielts-examples"?"/ielts-examples/sample-reading":slug==="quick-tips"?"/quick-tips/lessons/tip-polite-requests":`/lessons/${sample.slug}`}>Open sample</a></div>}
    {slug==="ielts-examples"&&<div className="folder-help"><FolderOpen size={22}/><div><strong>Try a Speaking example</strong><p>Choose a question, play its model answer, and read the text below.</p></div><a className="button secondary" href="/ielts-examples/categories/ielts-speaking">Explore Speaking</a></div>}
    {slug==="youtube-videos"&&<p className="notice">The sample is original text practice. No YouTube video is attached.</p>}
  </section>
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getVideoCategories } from "@/lib/video-categories";
import { isLearningSection, learningSections } from "@/lib/section-folders";
import { lessons } from "@/lib/content";

export const dynamic="force-dynamic";
export default async function SectionFolderPage({params}:{params:Promise<{section:string;id:string}>}){
  const {section,id}=await params;
  if(!isLearningSection(section))notFound();
  const config=learningSections[section];
  let categories:Awaited<ReturnType<typeof getVideoCategories>>;
  try{categories=await getVideoCategories(config.section)}catch{return <section className="section shell"><p className="notice">This folder is temporarily unavailable. Please try again later.</p></section>}
  const folder=categories.find(category=>category.id===id);
  if(!folder)notFound();
  const parent=categories.find(category=>category.id===folder.parentId),children=categories.filter(category=>category.parentId===id);
  const sample=id===config.sampleCategory?lessons.find(lesson=>lesson.slug===config.sample):undefined;
  return <section className="section shell catalog-page">
    <Link className="folder-back" href={parent?`/${section}/categories/${parent.id}`:`/${section}`}><ArrowLeft size={18}/>{parent?parent.name:`All ${config.title} folders`}</Link>
    <span className="section-eyebrow">{config.title.toUpperCase()}</span><h1>{folder.name}</h1>
    {children.length>0&&<div className="video-folder-grid">{children.map(child=><Link className="video-folder-card" href={`/${section}/categories/${child.id}`} key={child.id}><span className="folder-icon"><FolderOpen size={27}/></span><h2>{child.name}</h2><span className="folder-open">Open folder</span></Link>)}</div>}
    {sample?<div className="lesson-grid"><Link className="lesson-card" href={`/lessons/${sample.slug}`}><div className="lesson-content"><span className="section-eyebrow">SAMPLE · {sample.level}</span><h2>{sample.title}</h2><p>{sample.description}</p><span className="text-link">Open lesson</span></div></Link></div>:children.length===0?<div className="folder-empty"><FolderOpen size={40}/><h2>No lessons in this folder yet</h2><p>The administrator can organize this folder now. Publishing lessons here is coming later.</p></div>:null}
  </section>
}

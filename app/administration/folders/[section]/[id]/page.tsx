import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { FolderOpen } from "lucide-react";
import { getDb } from "@/db";
import { ieltsSpeakingExamples, quickTipLessons, readingItems, routineLessons, videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { DEFAULT_CATEGORIES, type ContentSection } from "@/lib/video";
import { sampleCatalog } from "@/lib/sample-catalog";
import { hiddenSampleIds } from "@/lib/sample-visibility";
import { AdminExampleAction, SampleManager } from "@/components/admin-example-actions";

export const dynamic="force-dynamic";
const studio:Record<ContentSection,string>={video:"videos",speaking:"speaking",reading:"reading",daily:"routines",youtube:"youtube",ielts:"ielts",tips:"quick-tips"};
const title:Record<ContentSection,string>={video:"Video Lessons & News",speaking:"Speaking Practice",reading:"Reading Room",daily:"Daily Lessons",youtube:"YouTube Videos",ielts:"IELTS Examples",tips:"Quick Tips"};
type Entry={id:string;title:string;status:string;href:string};
export default async function AdminFolder({params}:{params:Promise<{section:string;id:string}>}){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  const {section,id}=await params;if(!Object.hasOwn(DEFAULT_CATEGORIES,section))notFound();const kind=section as ContentSection;
  try{
    const [categories,hidden]=await Promise.all([getVideoCategories(kind),hiddenSampleIds()]),folder=categories.find(item=>item.id===id);if(!folder)notFound();
    const children=categories.filter(item=>item.parentId===id),db=getDb();let entries:Entry[]=[];
    if(kind==="video"||kind==="speaking"||kind==="youtube")entries=(await db.select().from(videoLessons).where(eq(videoLessons.category,id)).all()).filter(item=>item.contentKind===kind).map(item=>({id:item.id,title:item.title,status:item.status,href:`/video-lessons/${item.id}`}));
    else if(kind==="reading")entries=(await db.select().from(readingItems).where(eq(readingItems.category,id)).all()).map(item=>({id:item.id,title:item.title,status:item.status,href:`/reading-room/${item.id}`}));
    else if(kind==="daily")entries=(await db.select().from(routineLessons).where(eq(routineLessons.category,id)).all()).map(item=>({id:item.id,title:item.title,status:item.status,href:`/daily-lessons/routines/${item.id}`}));
    else if(kind==="ielts")entries=(await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.category,id)).all()).map(item=>({id:item.id,title:item.question,status:item.status,href:`/ielts-examples/practice/${item.id}`}));
    else entries=(await db.select().from(quickTipLessons).where(eq(quickTipLessons.category,id)).all()).map(item=>({id:item.id,title:item.title,status:item.status,href:`/quick-tips/lessons/${item.id}`}));
    const parent=folder.parentId?categories.find(item=>item.id===folder.parentId):undefined;
    return <section className="section shell admin-page admin-folder-page"><a className="folder-back" href={parent?`/administration/folders/${kind}/${parent.id}`:`/administration/${studio[kind]}`}>← {parent?.name||`${title[kind]} studio`}</a><span className="section-eyebrow">ADMINISTRATION · {title[kind].toUpperCase()}</span><h1>{folder.name}</h1><p>Manage this folder and its content. Draft lessons are visible here to administrators.</p><div className="admin-folder-actions"><a className="button primary" href={`/administration/${studio[kind]}#add-content`}>Add a lesson</a><a className="button secondary" href={`/administration/${studio[kind]}`}>Manage folders</a></div>{children.length>0&&<><h2>Subfolders</h2><div className="video-folder-grid">{children.map(child=><a className="video-folder-card" href={`/administration/folders/${kind}/${child.id}`} key={child.id}><span className="folder-icon"><FolderOpen size={25}/></span><h3>{child.name}</h3><span className="folder-open">Open folder</span></a>)}</div></>}<h2>Lessons in this folder</h2>{entries.length?<div className="admin-folder-list">{entries.map(item=><div className="admin-folder-entry" key={item.id}><div><strong>{item.title}</strong><span>{item.status}</span></div><div><a href={item.href}>Preview</a><a href={`/administration/${studio[kind]}#lesson-${item.id}`}>Edit</a><AdminExampleAction id={item.id} title={item.title} kind={kind}/></div></div>)}</div>:<div className="folder-empty"><FolderOpen size={35}/><h3>No admin-created lessons here yet</h3><p>Add one from the {title[kind]} studio.</p></div>}<SampleManager samples={sampleCatalog.filter(item=>item.section===kind&&item.category===id)} hidden={[...hidden]}/></section>;
  }catch{return <section className="section shell"><h1>Folder unavailable</h1><p className="notice">This administration folder could not be loaded right now.</p><a href="/administration">Back to Administration</a></section>}
}

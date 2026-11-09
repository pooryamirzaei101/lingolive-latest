import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import Link from "next/link";
import {notFound} from "next/navigation";
import {asc,eq,inArray} from "drizzle-orm";
import {getDb} from "@/db";
import {readingBlocks,readingChapters,readingItems} from "@/db/schema";
import {isAdmin} from "@/lib/admin";
import {ReadingReader} from "@/components/reading-reader";
import {readingExamples} from "@/lib/reading-examples";
import {isSampleHidden} from "@/lib/sample-visibility";

export const dynamic="force-dynamic";

export default async function ReadingLesson({params}:{params:Promise<{id:string}>}){
  const {id}=await params,sample=readingExamples.find(item=>item.id===id);
  if(sample&&await isSampleHidden(id))notFound();
  if(!await canLearn('reading',id))return <MembershipLock/>;
  if(sample)return <section className="section shell reading-page"><Link href={`/reading-room/categories/${sample.category}`} className="folder-back">← Back to shelf</Link><span className="section-eyebrow">READING ROOM · SAMPLE · {sample.level}</span><h1>{sample.title}</h1><p>{sample.description}</p><ReadingReader chapters={[...sample.chapters]}/></section>;
  const item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();
  if(!item||(item.status!=="published"&&!await isAdmin()))notFound();
  const chapters=await getDb().select().from(readingChapters).where(eq(readingChapters.itemId,id)).orderBy(asc(readingChapters.position)).all();
  const blocks=chapters.length?await getDb().select().from(readingBlocks).where(inArray(readingBlocks.chapterId,chapters.map(chapter=>chapter.id))).orderBy(asc(readingBlocks.position)).all():[];
  const blocksByChapter=new Map<string,typeof blocks>();
  for(const block of blocks){const group=blocksByChapter.get(block.chapterId)||[];group.push(block);blocksByChapter.set(block.chapterId,group)}
  return <section className="section shell reading-page"><Link href={`/reading-room/categories/${item.category}`} className="folder-back">← Back to shelf</Link><span className="section-eyebrow">READING ROOM · {item.level} {item.status==="draft"?"· DRAFT PREVIEW":""}</span><h1>{item.title}</h1><p>{item.description}</p>{item.documentKey&&<div className="reading-document"><h2>Original PDF</h2><p>Read the PDF here. The editable text in each unit provides tappable vocabulary.</p><iframe src={`/api/reading-items/${item.id}/document#toolbar=0`} title={`PDF for ${item.title}`}/></div>}<ReadingReader chapters={chapters.map(chapter=>({...chapter,blocks:blocksByChapter.get(chapter.id)||[]}))}/></section>;
}

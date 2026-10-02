import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { readingChapters, readingItems } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { ReadingReader } from "@/components/reading-reader";
export const dynamic="force-dynamic";
export default async function ReadingLesson({params}:{params:Promise<{id:string}>}){const {id}=await params,item=await getDb().select().from(readingItems).where(eq(readingItems.id,id)).get();if(!item||(item.status!=="published"&&!await isAdmin()))notFound();const chapters=await getDb().select().from(readingChapters).where(eq(readingChapters.itemId,id)).orderBy(asc(readingChapters.position)).all();return <section className="section shell reading-page"><Link href={`/reading-room/categories/${item.category}`} className="folder-back">← Back to shelf</Link><span className="section-eyebrow">READING ROOM · {item.level} {item.status==="draft"?"· DRAFT PREVIEW":""}</span><h1>{item.title}</h1><p>{item.description}</p><ReadingReader chapters={chapters}/></section>}

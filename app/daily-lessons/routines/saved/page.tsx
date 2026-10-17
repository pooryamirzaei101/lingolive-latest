import {canLearn} from '@/lib/membership';
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedRoutines } from "@/db/schema";
import { getRoutine } from "@/lib/routines";
export const dynamic="force-dynamic";
export default async function SavedRoutines(){
  const user=await getChatGPTUser();if(!user)return <section className="section shell catalog-page"><Link className="folder-back" href="/daily-lessons/routines">← Routines</Link><h1>Saved routines</h1><p>Sign in to review your saved lessons.</p><a className="button primary" href={chatGPTSignInPath("/daily-lessons/routines/saved")}>Sign in</a></section>;
  try{const rows=await getDb().select().from(savedRoutines).where(eq(savedRoutines.userId,user.userId)).orderBy(desc(savedRoutines.createdAt)).limit(100).all(),lessons=(await Promise.all(rows.map(row=>getRoutine(row.lessonId)))).filter((lesson):lesson is NonNullable<typeof lesson>=>lesson!=null);const access=new Set((await Promise.all(lessons.map(async i=>await canLearn('routine',i.id)?i.id:''))).filter(Boolean));return <section className="section shell catalog-page routines-catalog"><Link className="folder-back" href="/daily-lessons/routines">← Routines</Link><h1>Saved routines</h1>{lessons.length?<div className="routines-grid">{lessons.map(lesson=><Link className="routine-card" href={`/daily-lessons/routines/${lesson.id}`} key={lesson.id}><span className="section-eyebrow">SAVED FOR REVIEW</span><h2>{lesson.title}</h2><strong>{access.has(lesson.id)?lesson.phrase:'Membership lesson'}</strong><p>{access.has(lesson.id)?lesson.explanation:'Renew membership to open this lesson.'}</p><span>Review lesson</span></Link>)}</div>:<div className="folder-empty"><h2>No saved routines yet</h2><p>Open a routine lesson and select Save for review.</p><Link className="button primary" href="/daily-lessons/routines">Browse routines</Link></div>}</section>}catch{return <section className="section shell"><h1>Saved routines</h1><p className="notice">Your saved lessons are temporarily unavailable.</p></section>}
}

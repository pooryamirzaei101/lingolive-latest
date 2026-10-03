import {canLearn} from '@/lib/membership';
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { listRoutines } from "@/lib/routines";
export const dynamic="force-dynamic";
export default async function Routines(){
  let lessons:Awaited<ReturnType<typeof listRoutines>>=[];let unavailable=false;try{lessons=await listRoutines()}catch{unavailable=true}const admin=await isAdmin();
  const access=new Set((await Promise.all(lessons.map(async i=>await canLearn('routine',i.id)?i.id:''))).filter(Boolean));
  return <section className="section shell catalog-page routines-catalog"><Link className="folder-back" href="/daily-lessons">← Daily Lessons</Link><span className="section-eyebrow">DAILY LESSONS</span><h1>Routines</h1><p>Learn a useful phrase, read short examples, and listen to a voice recording when one is available.</p><div className="routines-actions"><Link className="button secondary" href="/daily-lessons/routines/saved">Saved routines</Link>{admin&&<Link className="button secondary" href="/administration/routines">Manage routines</Link>}</div>{unavailable?<p className="notice">Routine lessons are temporarily unavailable.</p>:<div className="routines-grid">{lessons.map(lesson=><Link href={`/daily-lessons/routines/${lesson.id}`} className="routine-card" key={lesson.id}><span className="section-eyebrow">DAILY PHRASE</span><h2>{lesson.title}</h2><strong>{access.has(lesson.id)?lesson.phrase:'Membership lesson'}</strong><p>{access.has(lesson.id)?lesson.explanation:'Renew membership to open this lesson.'}</p><span>Open lesson</span></Link>)}</div>}</section>
}

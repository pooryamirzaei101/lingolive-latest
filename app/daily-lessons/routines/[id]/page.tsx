import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedRoutines } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getRoutine } from "@/lib/routines";
import { InteractiveEnglish } from "@/components/interactive-english";
import { RoutineSaveButton } from "@/components/routine-save-button";
export const dynamic="force-dynamic";
export default async function RoutineDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params,admin=await isAdmin(),lesson=await getRoutine(id,admin);if(!lesson)notFound();
  const user=await getChatGPTUser(),saved=user?!!await getDb().select({id:savedRoutines.id}).from(savedRoutines).where(and(eq(savedRoutines.userId,user.userId),eq(savedRoutines.lessonId,id))).get():false;
  if(lesson.status!=="published"&&!saved&&!admin)notFound();
  return <section className="section shell routine-lesson"><Link className="folder-back" href="/daily-lessons/routines">← Routines</Link><span className="section-eyebrow">DAILY LESSONS · ROUTINES {lesson.status==="draft"?"· SAVED OR ADMIN PREVIEW":""}</span><h1>{lesson.title}</h1><div className="routine-phrase"><span className="section-eyebrow">TODAY’S PHRASE</span><h2><InteractiveEnglish text={lesson.phrase} translation={lesson.phraseTranslation}/></h2>{lesson.phraseTranslation&&<p lang="fa" dir="rtl">{lesson.phraseTranslation}</p>}<p>{lesson.explanation}</p></div>{lesson.audioKey&&<div className="routine-audio"><h2>Listen</h2><audio controls controlsList="nodownload" preload="none" src={`/api/routines/${lesson.id}/audio`} aria-label={`${lesson.title} narration`}/></div>}<div className="routine-examples"><h2>Examples</h2>{[[lesson.exampleOne,lesson.exampleOneTranslation],[lesson.exampleTwo,lesson.exampleTwoTranslation]].map(([english,persian],index)=><div className="routine-example" key={index}><strong>{index+1}</strong><div><p><InteractiveEnglish text={english} translation={persian}/></p>{persian&&<small lang="fa" dir="rtl">{persian}</small>}</div></div>)}</div><div className="routine-story"><h2>Short lesson</h2>{lesson.body.split(/\n\s*\n/).filter(Boolean).map((paragraph,index)=><p key={index}><InteractiveEnglish text={paragraph}/></p>)}</div><RoutineSaveButton lessonId={lesson.id} initial={saved} signedIn={!!user}/></section>
}

import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import {TimedAudioLesson} from "@/components/timed-audio-lesson";
import {LearningTranslation} from "@/components/learning-translation";
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
  if(!await canLearn('routine',id))return <MembershipLock/>;
  return <section className="section shell routine-lesson"><Link className="folder-back" href="/daily-lessons/routines">← Routines</Link><span className="section-eyebrow">DAILY LESSONS · ROUTINES {lesson.status==="draft"?"· SAVED OR ADMIN PREVIEW":""}</span><h1>{lesson.title}</h1><div className="routine-phrase"><span className="section-eyebrow">TODAY’S PHRASE</span><h2><InteractiveEnglish text={lesson.phrase} translation={lesson.phraseTranslation}/></h2><LearningTranslation section="routine" id={id} field="phrase" manual={lesson.phraseTranslation}/><p><InteractiveEnglish text={lesson.explanation}/></p><LearningTranslation section="routine" id={id} field="explanation"/></div>{lesson.audioKey&&<div className="routine-audio"><h2>Listen</h2><TimedAudioLesson section="routine" id={id} src={`/api/routines/${lesson.id}/audio`}/></div>}<div className="routine-examples"><h2>Examples</h2>{[[lesson.exampleOne,lesson.exampleOneTranslation],[lesson.exampleTwo,lesson.exampleTwoTranslation]].map(([english,persian],index)=><div className="routine-example" key={index}><strong>{index+1}</strong><div><p><InteractiveEnglish text={english} translation={persian}/></p><LearningTranslation section="routine" id={id} field={index===0?"exampleOne":"exampleTwo"} manual={persian}/></div></div>)}</div><div className="routine-story"><h2>Short lesson</h2>{lesson.body.split(/\n\s*\n/).filter(Boolean).map((paragraph,index)=><p key={index}><InteractiveEnglish text={paragraph}/></p>)}<LearningTranslation section="routine" id={id} field="body"/></div><RoutineSaveButton lessonId={lesson.id} initial={saved} signedIn={!!user}/></section>
}

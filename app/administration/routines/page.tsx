import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { listRoutines, morningRoutine } from "@/lib/routines";
import { RoutineAdminForm } from "@/components/routine-admin-form";
export const dynamic="force-dynamic";
export default async function RoutineAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  try{const lessons=await listRoutines(true);return <section className="section shell admin-page"><Link className="folder-back" href="/administration">← Administration</Link><span className="section-eyebrow">DAILY LESSONS</span><h1>Routines editor</h1><p>Add short phrases, examples, explanations, lesson text, and an optional voice recording. Choose Draft or Published before saving.</p><div className="routine-admin-grid"><div><h2>Edit routine lessons</h2>{lessons.map(lesson=><details className="chapter-editor" key={lesson.id}><summary>{lesson.title} · {lesson.status}{lesson.id===morningRoutine.id&&lesson.createdAt===0?" · original sample":""}</summary><div className="routine-admin-item"><Link href={`/daily-lessons/routines/${lesson.id}`}>Preview lesson</Link><RoutineAdminForm lesson={lesson}/></div></details>)}</div><aside className="detail-panel"><h2>Add a routine lesson</h2><RoutineAdminForm/></aside></div></section>}catch{return <section className="section shell"><h1>Routines editor</h1><p className="notice">Routine lessons are temporarily unavailable. Please try again.</p></section>}
}

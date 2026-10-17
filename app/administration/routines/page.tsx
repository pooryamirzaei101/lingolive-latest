import {AudioTranscriptStudio} from "@/components/audio-transcript-studio";
import {ContentTranslationEditor} from "@/components/content-translation-editor";
import { AdminSamples } from "@/components/admin-samples";
import { isAdmin } from "@/lib/admin";
import { listRoutines, morningRoutine } from "@/lib/routines";
import { RoutineAdminForm } from "@/components/routine-admin-form";
import { CategoryManager } from "@/components/video-admin";
import { getVideoCategories } from "@/lib/video-categories";
export const dynamic="force-dynamic";
export default async function RoutineAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  try{const [lessons,categories]=await Promise.all([listRoutines(true),getVideoCategories("daily")]);return <section className="section shell admin-page"><a className="folder-back" href="/administration">← Administration</a><span className="section-eyebrow">DAILY LESSONS</span><h1>Routines editor</h1><p>Add short phrases, examples, explanations, lesson text, and an optional voice recording. Choose Draft or Published before saving.</p><CategoryManager categories={categories} section="daily"/><div className="routine-admin-grid"><div><h2>Edit routine lessons</h2>{lessons.map(lesson=><details className="chapter-editor" id={`lesson-${lesson.id}`} key={lesson.id}><summary>{lesson.title} · {lesson.status}{lesson.id===morningRoutine.id&&lesson.createdAt===0?" · original sample":""}</summary><div className="routine-admin-item"><a href={`/daily-lessons/routines/${lesson.id}`}>Preview lesson</a><RoutineAdminForm lesson={lesson} categories={categories}/><AudioTranscriptStudio section="routine" id={lesson.id}/><ContentTranslationEditor section="routine" id={lesson.id}/></div></details>)}</div><aside className="detail-panel" id="add-content"><h2>Add a routine lesson</h2><RoutineAdminForm categories={categories}/></aside></div><AdminSamples section="daily"/></section>}catch{return <section className="section shell"><h1>Routines editor</h1><p className="notice">Routine lessons are temporarily unavailable. Please try again.</p></section>}
}

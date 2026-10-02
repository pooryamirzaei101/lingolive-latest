import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { parseTranscript } from "@/lib/video";
import { VideoLearningPlayer } from "@/components/video-learning-player";
export const dynamic="force-dynamic";
export default async function VideoLesson({params}:{params:Promise<{id:string}>}){const {id}=await params;const lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson||(lesson.status!=="published"&&!await isAdmin()))notFound();return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{lesson.category} · {lesson.level} {lesson.status==="draft"?"· DRAFT PREVIEW":""}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></section><section className="section shell"><VideoLearningPlayer id={id} lines={parseTranscript(lesson.transcript)}/></section></>}

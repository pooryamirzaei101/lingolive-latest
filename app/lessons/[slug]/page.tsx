import { notFound } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { lessons } from "@/lib/content";
import { LessonPlayer } from "@/components/lesson-player";
export function generateStaticParams(){return lessons.map(l=>({slug:l.slug}))}
export default async function LessonDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=lessons.find(l=>l.slug===slug);if(!lesson)notFound();return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{lesson.category} · {lesson.level} · {lesson.minutes} MIN</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></section><section className="section shell page-content">{lesson.status==="Premium"?<div className="empty-state"><LockKeyhole size={38} color="#2563e8"/><h2>Premium lesson preview</h2><p>This lesson is reserved for Premium learners. Subscriptions are not available in this first version.</p><Link className="button primary" href="/premium">Learn about Premium</Link></div>:<LessonPlayer lesson={lesson}/>}</section></>}

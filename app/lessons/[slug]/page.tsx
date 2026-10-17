import {canLearn} from '@/lib/membership';
import { notFound } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { lessons } from "@/lib/content";
import { LessonPlayer } from "@/components/lesson-player";
import { isSampleHidden } from "@/lib/sample-visibility";
export function generateStaticParams(){return lessons.map(l=>({slug:l.slug}))}
export default async function LessonDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(await isSampleHidden(slug))notFound();if(slug==="a-morning-routine")redirect("/daily-lessons/routines/morning-routine");if(slug==="tip-polite-requests")redirect("/quick-tips/lessons/tip-polite-requests");const lesson=lessons.find(l=>l.slug===slug);if(!lesson)notFound();return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{lesson.category} · {lesson.level} · {lesson.minutes} MIN</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div></section><section className="section shell page-content">{!await canLearn('lesson',slug)?<div className="empty-state"><LockKeyhole size={38} color="#2563e8"/><h2>Premium lesson preview</h2><p>This lesson is reserved for Premium learners. Choose a membership plan to unlock this lesson.</p><Link className="button primary" href="/premium">Learn about Premium</Link></div>:<LessonPlayer lesson={lesson}/>}</section></>}

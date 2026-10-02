import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, lessons } from "@/lib/content";
import { LessonCard } from "@/components/learning";
export function generateStaticParams(){return courses.map(c=>({slug:c.slug}))}
export default async function CourseDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const course=courses.find(c=>c.slug===slug);if(!course)notFound();const related=lessons.filter(l=>l.course===course.title);return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">{course.level} · {course.status}</span><h1>{course.title}</h1><p>{course.description}</p></div></section><section className="section shell page-content"><h2>Lessons in this course</h2><p className="notice">This preview includes {related.length} sample {related.length===1?"lesson":"lessons"}. The full course will grow as new lessons are added.</p><div className="lesson-grid" style={{marginTop:24}}>{related.map(l=><LessonCard key={l.slug} lesson={l}/>)}</div><p style={{marginTop:30}}><Link className="text-link" href="/courses">See all courses</Link></p></section></>}

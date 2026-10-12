import {eq} from 'drizzle-orm';
import {notFound} from 'next/navigation';
import {getDb} from '@/db';
import {videoLessons} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import {TimedAudioLesson} from '@/components/timed-audio-lesson';
export const dynamic='force-dynamic';
export default async function Podcast({params}:{params:Promise<{id:string}>}){const {id}=await params,lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson||lesson.contentKind!=='podcast'||lesson.status!=='published'&&!await isAdmin())notFound();if(!await canLearn('video',id))return <MembershipLock/>;return <section className="section shell catalog-page"><a href="/podcasts" className="folder-back">← Podcasts</a><span className="section-eyebrow">PODCAST · {lesson.mimeType.startsWith('audio/')?'AUDIO':'VIDEO'} {lesson.status==='draft'?'· DRAFT PREVIEW':''}</span><h1>{lesson.title}</h1><p>{lesson.description}</p><TimedAudioLesson section="video" id={id} src={`/api/video-lessons/${id}/media`} video={!lesson.mimeType.startsWith('audio/')}/></section>}

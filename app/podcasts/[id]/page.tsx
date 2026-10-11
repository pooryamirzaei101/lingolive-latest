import {eq} from 'drizzle-orm';
import {notFound} from 'next/navigation';
import {getDb} from '@/db';
import {videoLessons} from '@/db/schema';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin';
import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import {preferredLanguage} from '@/lib/translation-service';
import {parseTranscript} from '@/lib/video';
import {PodcastPlayer} from '@/components/podcast-player';
export const dynamic='force-dynamic';
export default async function Podcast({params}:{params:Promise<{id:string}>}){const {id}=await params,lesson=await getDb().select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!lesson||lesson.contentKind!=='podcast'||lesson.status!=='published'&&!await isAdmin())notFound();if(!await canLearn('video',id))return <MembershipLock/>;const user=await getChatGPTUser(),language=user?await preferredLanguage(user.userId):'fa';return <section className="section shell catalog-page"><a href="/podcasts" className="folder-back">← Podcasts</a><span className="section-eyebrow">PODCAST · {lesson.mimeType.startsWith('audio/')?'AUDIO':'VIDEO'} {lesson.status==='draft'?'· DRAFT PREVIEW':''}</span><h1>{lesson.title}</h1><p>{lesson.description}</p><PodcastPlayer id={id} lines={parseTranscript(lesson.transcript)} audio={lesson.mimeType.startsWith('audio/')} initialLanguage={language} signedIn={!!user}/></section>}

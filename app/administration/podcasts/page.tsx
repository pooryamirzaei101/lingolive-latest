import {eq,desc} from 'drizzle-orm';
import {redirect} from 'next/navigation';
import {getDb} from '@/db';
import {videoLessons} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {PodcastCreate,PodcastEdit} from '@/components/podcast-admin';
export const dynamic='force-dynamic';
export default async function PodcastStudio(){if(!await isAdmin())redirect('/login');const items=await getDb().select().from(videoLessons).where(eq(videoLessons.contentKind,'podcast')).orderBy(desc(videoLessons.createdAt)).all();return <section className="section shell admin-page"><a className="folder-back" href="/administration">← Administration</a><span className="section-eyebrow">ADMINISTRATION</span><h1>Podcasts studio</h1><p>Upload an audio or video podcast. Add an English SRT or generate English timestamps with AssemblyAI, review the transcript, then publish. Students see English subtitles and translate only the words or phrases they tap.</p><div className="detail-grid"><div className="detail-panel"><h2>Podcast drafts and lessons</h2>{items.map(item=><article className="admin-lesson" key={item.id}><details><summary><strong>{item.title}</strong> · {item.status} · {item.mimeType.startsWith('audio/')?'audio':'video'}</summary><PodcastEdit podcast={{id:item.id,title:item.title,status:item.status,transcript:item.transcript,mimeType:item.mimeType}}/></details></article>)}{!items.length&&<p>No podcasts yet.</p>}</div><aside className="detail-panel"><h2>Add podcast</h2><PodcastCreate/></aside></div></section>}

import {and,desc,eq,like,inArray} from 'drizzle-orm';
import {getDb} from '@/db';
import {videoLessons,contentAccess} from '@/db/schema';
import {mediaSections,type MediaSection} from '@/lib/media-sections';
export async function PlacedMedia({section,freeOnly=false}:{section:MediaSection;freeOnly?:boolean}){
 let items:typeof videoLessons.$inferSelect[];
 try{
 items=await getDb().select().from(videoLessons).where(and(eq(videoLessons.status,'published'),like(videoLessons.sections,`%"${section}"%`))).orderBy(desc(videoLessons.createdAt)).all();
 if(freeOnly&&items.length){const free=await getDb().select().from(contentAccess).where(and(eq(contentAccess.free,1),inArray(contentAccess.id,items.map(i=>`video:${i.id}`)))).all() as Array<typeof contentAccess.$inferSelect>,ids=new Set(free.map(r=>r.id));items=items.filter(i=>ids.has(`video:${i.id}`))}
 }catch{return null}
 if(section==='podcast')items=items.filter(i=>i.contentKind!=='podcast');
 if(!items.length)return null;
 return <section className="section shell placed-media"><h2>{mediaSections[section]} · Media lessons</h2><div className="lesson-grid">{items.map(item=><a key={item.id} className="home-section-card" href={item.contentKind==='podcast'?`/podcasts/${item.id}`:`/video-lessons/${item.id}`}><span aria-hidden="true">{item.contentKind==='youtube'?'▶':item.mimeType.startsWith('audio/')?'♫':'▷'}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.level} · {item.contentKind==='youtube'?'YouTube':item.mimeType.startsWith('audio/')?'Audio':'Uploaded video'} · {item.displayFormat==='vertical'?'Vertical / Short':item.displayFormat==='square'?'Square':'Landscape'}</small></a>)}</div></section>
}

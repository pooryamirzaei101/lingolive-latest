import {and,eq,desc} from 'drizzle-orm';
import {getDb} from '@/db';
import {learningProgress,learningDaily,videoLessons,ieltsSpeakingExamples,readingItems,routineLessons,quickTipLessons,contentAccess,ieltsProgress,hiddenSamples} from '@/db/schema';
import {defaultFree,membership} from '@/lib/membership';
import {isAdmin} from '@/lib/admin';
import {videoExample,newsExample,speakingVideoExample} from '@/lib/video-example';
import {readingExamples} from '@/lib/reading-examples';
import {ieltsSamples} from '@/lib/ielts-speaking';
import {morningRoutine} from '@/lib/routines';
import {sampleTips} from '@/lib/quick-tips';
import {lessons} from '@/lib/content';
import {progressSections,type ProgressLesson,type ProgressSection} from '@/lib/learning-progress';

const item=(section:ProgressSection,lessonId:string,title:string,href:string,accessSection:string,accessId=lessonId):ProgressLesson=>({section,lessonId,title,href,accessSection,accessId});
export async function achievementsData(userId:string){const db=getDb();const [videos,ielts,readings,routines,tips,overrides,hidden,progress,daily,legacy,paid,admin]=await Promise.all([
 db.select().from(videoLessons).where(eq(videoLessons.status,'published')).all(),db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.status,'published')).all(),db.select().from(readingItems).where(eq(readingItems.status,'published')).all(),db.select().from(routineLessons).where(eq(routineLessons.status,'published')).all(),db.select().from(quickTipLessons).where(eq(quickTipLessons.status,'published')).all(),db.select().from(contentAccess).all(),db.select({id:hiddenSamples.id}).from(hiddenSamples).all(),db.select().from(learningProgress).where(eq(learningProgress.userId,userId)).orderBy(desc(learningProgress.lastAccessedAt)).all(),db.select().from(learningDaily).where(eq(learningDaily.userId,userId)).all(),db.select().from(ieltsProgress).where(eq(ieltsProgress.userId,userId)).all(),membership(userId),isAdmin()]);
 const hiddenIds=new Set(hidden.map(h=>h.id)),entries:ProgressLesson[]=[];
 for(const row of videos){const section=row.contentKind==='podcast'?'podcast':row.contentKind==='speaking'?'speaking':'video',href=section==='podcast'?`/podcasts/${row.id}`:`/video-lessons/${row.id}`;entries.push(item(section,row.id,row.title,href,'video'))}
 for(const sample of [videoExample,newsExample,speakingVideoExample])if(!hiddenIds.has(sample.id))entries.push(item(sample.id===speakingVideoExample.id?'speaking':'video',sample.id,sample.title,`/video-lessons/${sample.id}`,'video'));
 for(const row of ielts)if(['listening','speaking_video'].includes(row.kind))entries.push(item(row.kind==='speaking_video'?'ielts_video':'ielts_listening',row.id,row.question,`${row.kind==='speaking_video'?'/ielts-video-speaking':'/ielts-listening-reading'}/lessons/${row.id}`,'ielts'));
 for(const sample of ieltsSamples)if(!hiddenIds.has(sample.id))entries.push(item('ielts_listening',sample.id,sample.question,`/ielts-listening-reading/lessons/${sample.id}`,'ielts'));
 for(const row of readings)entries.push(item('reading',row.id,row.title,`/reading-room/${row.id}`,'reading'));
 for(const sample of readingExamples)if(!hiddenIds.has(sample.id))entries.push(item('reading',sample.id,sample.title,`/reading-room/${sample.id}`,'reading'));
 for(const row of routines)entries.push(item('daily',row.id,row.title,`/daily-lessons/routines/${row.id}`,'routine'));
 if(!hiddenIds.has(morningRoutine.id)&&!routines.some(r=>r.id===morningRoutine.id))entries.push(item('daily',morningRoutine.id,morningRoutine.title,`/daily-lessons/routines/${morningRoutine.id}`,'routine'));
 for(const row of tips)entries.push(item(row.category==='flashcards'?'flashcards':'tips',row.id,row.title,row.category==='flashcards'?`/flashcards/${row.id}`:`/quick-tips/lessons/${row.id}`,row.category==='flashcards'?'flashcards':'tips'));
 for(const sample of sampleTips)if(!hiddenIds.has(sample.id)&&!tips.some(t=>t.id===sample.id))entries.push(item('tips',sample.id,sample.title,`/quick-tips/lessons/${sample.id}`,'tips'));
 for(const row of lessons)if(!hiddenIds.has(row.slug)&&row.slug!=='a-morning-routine'&&row.slug!=='tip-polite-requests')entries.push(item('daily',row.slug,row.title,`/lessons/${row.slug}`,'lesson'));
 const access=new Map(overrides.map(o=>[o.id,!!o.free])),unlocked=admin||!!paid&&paid.expiresAt>Date.now(),available=entries.filter(e=>unlocked||(access.get(`${e.accessSection}:${e.accessId}`)??defaultFree(e.accessSection,e.accessId))),byKey=new Map(available.map(e=>[`${e.section}:${e.lessonId}`,e]));
 const records=new Map(progress.map(row=>[`${row.section}:${row.lessonId}`,row]));for(const old of legacy){const key=`${ielts.find(l=>l.id===old.lessonId)?.kind==='speaking_video'?'ielts_video':'ielts_listening'}:${old.lessonId}`,lesson=byKey.get(key);if(lesson&&!records.get(key)?.completedAt){const current=records.get(key);records.set(key,{id:current?.id||old.id,userId,section:lesson.section,lessonId:old.lessonId,title:lesson.title,href:lesson.href,firstAccessedAt:current?.firstAccessedAt||old.completedAt,lastAccessedAt:current?.lastAccessedAt||old.completedAt,completedAt:old.completedAt,activeSeconds:current?.activeSeconds||0,resumeSeconds:0})}}
 const sections=Object.entries(progressSections).map(([section,label])=>{const items=available.filter(e=>e.section===section),completed=items.filter(e=>records.get(`${e.section}:${e.lessonId}`)?.completedAt).length,seconds=daily.filter(d=>d.section===section).reduce((sum,d)=>sum+d.activeSeconds,0);return {section,label,total:items.length,completed,seconds}}).filter(s=>s.total>0);
 const history=[...records.values()].sort((a,b)=>b.lastAccessedAt-a.lastAccessedAt).slice(0,30).map(row=>({title:row.title,section:progressSections[row.section as ProgressSection]||row.section,href:row.href,lastAccessedAt:row.lastAccessedAt,seconds:row.activeSeconds,completed:!!row.completedAt,resumeSeconds:row.resumeSeconds}));
 return {sections,history,daily:daily.map(d=>({day:d.day,seconds:d.activeSeconds})),completed:[...records.values()].filter(r=>r.completedAt).length,totalSeconds:daily.reduce((sum,d)=>sum+d.activeSeconds,0)}
}

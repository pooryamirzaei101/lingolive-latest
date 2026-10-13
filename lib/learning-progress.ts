import {identifyProgressPath} from '@/lib/learning-progress-path';
import {and,eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {videoLessons,ieltsSpeakingExamples,readingItems,routineLessons,quickTipLessons,hiddenSamples} from '@/db/schema';
import {videoExample,newsExample,speakingVideoExample} from '@/lib/video-example';
import {readingExamples} from '@/lib/reading-examples';
import {ieltsSamples} from '@/lib/ielts-speaking';
import {morningRoutine} from '@/lib/routines';
import {sampleTips} from '@/lib/quick-tips';
import {lessons} from '@/lib/content';
import {canLearn} from '@/lib/membership';

export const progressSections={video:'Video Lessons',daily:'Daily Lessons',podcast:'Podcasts',ielts_listening:'IELTS Listening & Reading',ielts_video:'IELTS Video Speaking Practice',reading:'Reading Room',speaking:'Speaking Practice',tips:'Quick Tips',flashcards:'Flashcards'} as const;
export type ProgressSection=keyof typeof progressSections;
export type ProgressLesson={section:ProgressSection;lessonId:string;title:string;href:string;accessSection:string;accessId:string};
const progress=(section:ProgressSection,lessonId:string,title:string,href:string,accessSection:string,accessId=lessonId):ProgressLesson=>({section,lessonId,title,href,accessSection,accessId});
export async function resolveProgressLesson(path:string):Promise<ProgressLesson|null>{const route=identifyProgressPath(path);if(!route)return null;const {kind,id}=route,db=getDb();if(id.length>120)return null;
 const hidden=await db.select({id:hiddenSamples.id}).from(hiddenSamples).where(eq(hiddenSamples.id,id)).get();if(hidden)return null;
 if(kind==='video'||kind==='podcast'){const sample=[videoExample,newsExample,speakingVideoExample].find(s=>s.id===id);if(sample&&kind==='video')return progress(sample.id===speakingVideoExample.id?'speaking':'video',id,sample.title,path,'video');const row=await db.select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(!row||row.status!=='published'||(kind==='podcast'?!['podcast'].includes(row.contentKind):!['video','speaking'].includes(row.contentKind)))return null;return progress(row.contentKind==='podcast'?'podcast':row.contentKind==='speaking'?'speaking':'video',id,row.title,path,'video')}
 if(kind==='ielts_listening'||kind==='ielts_video'){const sample=ieltsSamples.find(s=>s.id===id);if(sample&&kind==='ielts_listening')return progress('ielts_listening',id,sample.question,path,'ielts');const row=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(!row||row.status!=='published'||(kind==='ielts_video')!==(row.kind==='speaking_video'))return null;return progress(kind,id,row.question,path,'ielts')}
 if(kind==='reading'){const sample=readingExamples.find(s=>s.id===id);if(sample)return progress('reading',id,sample.title,path,'reading');const row=await db.select().from(readingItems).where(eq(readingItems.id,id)).get();return row?.status==='published'?progress('reading',id,row.title,path,'reading'):null}
 if(kind==='routine'){if(id===morningRoutine.id)return progress('daily',id,morningRoutine.title,path,'routine');const row=await db.select().from(routineLessons).where(eq(routineLessons.id,id)).get();return row?.status==='published'?progress('daily',id,row.title,path,'routine'):null}
 if(kind==='tips'||kind==='flashcards'){const sample=kind==='tips'?sampleTips.find(s=>s.id===id):null;if(sample)return progress('tips',id,sample.title,path,'tips');const row=await db.select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(!row||row.status!=='published'||(kind==='flashcards')!==(row.category==='flashcards'))return null;return progress(kind,id,row.title,path,kind==='tips'?'tips':'flashcards')}
 const row=lessons.find(l=>l.slug===id);if(row)return progress('daily',id,row.title,path,'lesson');return null}
export async function authorizedProgressLesson(path:string){const lesson=await resolveProgressLesson(path);return lesson&&await canLearn(lesson.accessSection,lesson.accessId)?lesson:null}

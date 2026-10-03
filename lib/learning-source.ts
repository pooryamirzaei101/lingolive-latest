import {canLearn} from '@/lib/membership';
import {readingExamples} from "@/lib/reading-examples";
import {getRoutine} from "@/lib/routines";
import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {videoLessons,routineLessons,ieltsSpeakingExamples,quickTipLessons,readingChapters,readingItems,mediaTranscripts} from '@/db/schema';
import {parseTranscript} from '@/lib/video';
import {lessons} from '@/lib/content';
import {videoExample,newsExample,speakingVideoExample} from '@/lib/video-example';
import {isSampleHidden} from '@/lib/sample-visibility';
import {ieltsSamples} from '@/lib/ielts-speaking';
import {sampleTips} from '@/lib/quick-tips';
export type TextField={key:string;label:string;english:string;persian:string;translations?:Record<string,string>};
export async function learningSource(section:string,id:string,admin=false):Promise<TextField[]>{
 if(!admin&&!await canLearn(section,id))throw Error('Membership required.');
 const db=getDb();let record:any=null,fields:TextField[]=[];
 const add=(key:string,label:string,english:string,persian='',translations?:Record<string,string>)=>{if(english?.trim())fields.push({key,label,english,persian,translations})};
 if(section==='video'){
 const sample=[videoExample,newsExample,speakingVideoExample].find(s=>s.id===id);if(sample&&!await isSampleHidden(id)){sample.lines.forEach((s,i)=>add(`segment-${i}`,`Sentence ${i+1}`,s.english,s.translations.fa,s.translations));return await withTimed(fields,section,id)}
 record=await db.select().from(videoLessons).where(eq(videoLessons.id,id)).get();if(record&&(admin||record.status==='published')){parseTranscript(record.transcript).forEach((s,i)=>add(`segment-${i}`,`Sentence ${i+1}`,s.english,s.translations.fa,s.translations));return await withTimed(fields,section,id)}
 }else if(section==='routine'){
 record=await getRoutine(id,admin);if(record&&(admin||record.status==='published')){add('phrase','Daily phrase',record.phrase,record.phraseTranslation);add('explanation','Explanation',record.explanation);add('exampleOne','Example 1',record.exampleOne,record.exampleOneTranslation);add('exampleTwo','Example 2',record.exampleTwo,record.exampleTwoTranslation);add('body','Lesson text',record.body);return await withTimed(fields,section,id)}
 }else if(section==='ielts'){
 const sample=ieltsSamples.find(s=>s.id===id);if(sample&&!await isSampleHidden(id)){add('answer','Model answer',sample.answer,sample.translation);add('question','Question',sample.question);add('cue','Instructions',sample.cue);return await withTimed(fields,section,id)}
 record=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();if(record&&(admin||record.status==='published')){add('answer','Model answer',record.answer,record.translation);add('question','Question',record.question);add('cue','Instructions',record.cue);return await withTimed(fields,section,id)}
 }else if(section==='tips'){
 const sample=sampleTips.find(s=>s.id===id);if(sample&&!await isSampleHidden(id)){add('body','Tip',sample.body,sample.translation);add('example','Example',sample.example,sample.exampleTranslation);return await withTimed(fields,section,id)}
 record=await db.select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();if(record&&(admin||record.status==='published')){add('body','Tip',record.body,record.translation);add('example','Example',record.example,record.exampleTranslation);return await withTimed(fields,section,id)}
 }else if(section==='reading'){
 const sample=readingExamples.find(item=>item.chapters.some(c=>c.id===id));if(sample&&!await isSampleHidden(sample.id)){const chapter=sample.chapters.find(c=>c.id===id)!;add('body','Chapter text',chapter.body);return await withTimed(fields,section,id)}
 record=await db.select().from(readingChapters).where(eq(readingChapters.id,id)).get();if(record){const item=await db.select().from(readingItems).where(eq(readingItems.id,record.itemId)).get();if(item&&(admin||item.status==='published')){add('body','Chapter text',record.body,record.translation);return await withTimed(fields,section,id)}}
 }else if(section==='lesson'){
 const lesson=lessons.find(l=>l.slug===id);if(lesson&&!await isSampleHidden(id)){lesson.transcript.forEach((s,i)=>add(`line-${i}`,`Sentence ${i+1}`,s.english,s.persian));return await withTimed(fields,section,id)}
 }
 throw Error('This lesson is unavailable. Save the English content first.');
}

async function withTimed(fields:TextField[],section:string,id:string){if(!['routine','ielts','tips'].includes(section))return fields;const row=await getDb().select().from(mediaTranscripts).where(eq(mediaTranscripts.id,`${section}:${id}`)).get();if(row)parseTranscript(row.segments).forEach((s,i)=>fields.push({key:`segment-${i}`,label:`Audio sentence ${i+1}`,english:s.english,persian:s.translations.fa||'',translations:s.translations}));return fields}

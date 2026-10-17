import {canLearn} from '@/lib/membership';
import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {videoLessons,routineLessons,ieltsSpeakingExamples,quickTipLessons,mediaTranscripts} from '@/db/schema';
import {parseTranscript} from '@/lib/video';
export async function lessonMedia(section:string,id:string,admin=false){
 const db=getDb();const row=section==='video'?await db.select().from(videoLessons).where(eq(videoLessons.id,id)).get():section==='routine'?await db.select().from(routineLessons).where(eq(routineLessons.id,id)).get():section==='ielts'?await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get():section==='tips'?await db.select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get():null;
 if(!row||(!admin&&row.status!=='published'))throw Error('This media lesson is unavailable.');
 if(!admin&&!await canLearn(section,id))throw Error('Membership required.');
 const stored=section==='video'?null:await db.select().from(mediaTranscripts).where(eq(mediaTranscripts.id,`${section}:${id}`)).get();
 return {mediaKey:'mediaKey' in row?(row.contentKind==='youtube'?row.transcriptionKey||'':row.mediaKey):(section==='ielts'&&'kind' in row&&row.kind==='speaking_video'?row.videoKey:row.audioKey)||'',contentKind:'contentKind' in row?row.contentKind:section==='ielts'&&'kind' in row&&row.kind==='speaking_video'?'video':'audio',transcript:'transcript' in row?row.transcript:stored?.segments||'[]'};
}
export async function saveMediaTranscript(section:string,id:string,segments:string){const db=getDb();await lessonMedia(section,id,true);if(section==='video'){await db.update(videoLessons).set({transcript:segments,status:'draft'}).where(eq(videoLessons.id,id));return}
 await db.insert(mediaTranscripts).values({id:`${section}:${id}`,segments}).onConflictDoUpdate({target:mediaTranscripts.id,set:{segments}});
 if(section==='routine')await db.update(routineLessons).set({status:'draft'}).where(eq(routineLessons.id,id));else if(section==='ielts'){
  const answer=parseTranscript(segments).map(line=>line.english).join(' '),current=await db.select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id,id)).get();
  await db.update(ieltsSpeakingExamples).set({status:'draft',answer,translation:current?.answer===answer?current.translation:''}).where(eq(ieltsSpeakingExamples.id,id));
 }else if(section==='tips')await db.update(quickTipLessons).set({status:'draft'}).where(eq(quickTipLessons.id,id));
}

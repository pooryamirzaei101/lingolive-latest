import { desc, eq } from "drizzle-orm";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { speakingRecordings, videoLessons,ieltsSpeakingExamples } from "@/db/schema";
import { speakingVideoExample } from "@/lib/video-example";
import { SpeakingRecordingsList } from "@/components/speaking-recordings-list";
export const dynamic="force-dynamic";
export default async function MySpeakingRecordings(){
  const user=await getChatGPTUser();
  if(!user)return <section className="section shell speaking-recordings-page"><a className="folder-back" href="/speaking-practice">← Speaking Practice</a><h1>My Voices</h1><p>Sign in to listen to your saved recordings.</p><a className="button primary" href={chatGPTSignInPath("/speaking-practice/recordings")}>Sign in</a></section>;
  try{
    const [records,lessons,ielts]=await Promise.all([
      getDb().select({id:speakingRecordings.id,lessonId:speakingRecordings.lessonId,mimeType:speakingRecordings.mimeType,title:speakingRecordings.title,duration:speakingRecordings.duration,createdAt:speakingRecordings.createdAt}).from(speakingRecordings).where(eq(speakingRecordings.userId,user.userId)).orderBy(desc(speakingRecordings.createdAt)).limit(100).all(),
      getDb().select({id:videoLessons.id,title:videoLessons.title}).from(videoLessons).where(eq(videoLessons.contentKind,"speaking")).all(),
      getDb().select({id:ieltsSpeakingExamples.id,title:ieltsSpeakingExamples.question}).from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.kind,'speaking_video')).all()
    ]);
    const titles=Object.fromEntries([[speakingVideoExample.id,speakingVideoExample.title],...lessons.map(item=>[item.id,item.title]),...ielts.map(item=>[item.id,item.title])]);
    return <section className="section shell speaking-recordings-page"><a className="folder-back" href="/speaking-practice">← Speaking Practice</a><h1>My Voices</h1><SpeakingRecordingsList initial={records} titles={titles} ieltsIds={ielts.map(item=>item.id)}/></section>;
  }catch{return <section className="section shell speaking-recordings-page"><a className="folder-back" href="/speaking-practice">← Speaking Practice</a><h1>My Voices</h1><p role="alert">Recordings are temporarily unavailable. Please try again.</p></section>}
}

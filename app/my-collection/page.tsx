import { desc, eq } from "drizzle-orm";
import { getChatGPTUser, chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedSentences } from "@/db/schema";
import { CollectionList } from "@/components/collection-list";
export const dynamic="force-dynamic";
export default async function MyCollection(){
  const user=await getChatGPTUser();let sentences:typeof savedSentences.$inferSelect[]=[],error=false;
  if(user)try{sentences=await getDb().select().from(savedSentences).where(eq(savedSentences.userId,user.userId)).orderBy(desc(savedSentences.createdAt)).limit(200).all()}catch{error=true}
  return <section className="section shell catalog-page collection-page"><span className="section-eyebrow">MY COLLECTION</span><h1>Saved sentences</h1><p>Sentences you save from video, YouTube, news, and speaking lessons stay here for your account.</p>{!user?<div className="folder-empty"><h2>Sign in to see your collection</h2><a className="button primary" href={chatGPTSignInPath("/my-collection")}>Sign in</a></div>:error?<p className="notice">Your sentences are temporarily unavailable. Please try again.</p>:<CollectionList initial={sentences}/>}</section>
}

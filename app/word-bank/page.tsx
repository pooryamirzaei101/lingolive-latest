import { desc, eq } from "drizzle-orm";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { savedVocabulary } from "@/db/schema";
import { translationLanguages, isTranslationLanguage } from "@/lib/languages";
import { preferredLanguage } from "@/lib/translation-service";
import { WordBankList } from "@/components/word-bank-list";
export const dynamic="force-dynamic";
export default async function WordBank(){
  const user=await getChatGPTUser();let words:typeof savedVocabulary.$inferSelect[]=[],error=false,language="fa";
  if(user)try{[words,language]=await Promise.all([getDb().select().from(savedVocabulary).where(eq(savedVocabulary.userId,user.userId)).orderBy(desc(savedVocabulary.createdAt)).limit(500).all(),preferredLanguage(user.userId)])}catch{error=true}
  return <section className="section shell catalog-page word-bank-page"><span className="section-eyebrow">WORD BANK</span><h1>Saved words</h1><p>Double-tap or hold a word in a lesson to see its meaning, then save it here for review. Your selected language is {isTranslationLanguage(language)?translationLanguages[language]:language}. <a href="/account">Change language</a></p>{!user?<div className="folder-empty"><h2>Sign in to save words</h2><a className="button primary" href={chatGPTSignInPath("/word-bank")}>Sign in</a></div>:error?<p className="notice">Your saved words are temporarily unavailable. Please try again.</p>:<WordBankList initial={words}/>}</section>
}

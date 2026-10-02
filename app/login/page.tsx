import Link from "next/link";
import { eq } from "drizzle-orm";
import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { AccountForm } from "@/components/account-form";
import { getDb } from "@/db";
import { learnerPreferences } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
export const dynamic="force-dynamic";
export default async function Login(){
  const user=await getChatGPTUser();let language:string|undefined,error=false;
  if(user)try{language=(await getDb().select().from(learnerPreferences).where(eq(learnerPreferences.userId,user.userId)).get())?.translationLanguage}catch{error=true}
  const admin=user?await isAdmin():false;
  return <section className="section shell account-page"><span className="section-eyebrow">YOUR ACCOUNT</span><h1>{!user?"Sign in to EnglishFluento":language?"Your account":"Set up your learner profile"}</h1><div className="account-card">{!user?<><p>Sign in with your ChatGPT account to create a learner profile or return to your lessons.</p><a className="button primary" href={chatGPTSignInPath("/login")} target="_top">Continue with ChatGPT</a><p className="account-note">Your ChatGPT sign-in verifies your identity. EnglishFluento does not ask for a separate password.</p></>:<><p>Signed in as <strong>{user.displayName}</strong> ({user.email}).</p><p>Role: <strong>{admin?"Administrator":"Student"}</strong></p>{error?<p className="notice">Your profile could not be loaded. Please try again later.</p>:<AccountForm current={language}/>}<div className="account-actions">{admin&&<Link className="button secondary" href="/administration">Open Administration</Link>}<Link className="button secondary" href="/dashboard">My learning</Link><a className="button secondary" href={chatGPTSignOutPath("/login")} target="_top">Sign out</a></div></>}</div></section>
}

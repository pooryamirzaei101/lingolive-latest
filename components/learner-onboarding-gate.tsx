import {eq} from 'drizzle-orm';
import {getChatGPTUser,chatGPTSignOutPath} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin';
import {getDb} from '@/db';
import {learnerPreferences} from '@/db/schema';
import {syncLearnerProfile} from '@/lib/learner-profiles';
import {AccountForm} from '@/components/account-form';
export async function LearnerOnboardingGate({children}:{children:React.ReactNode}){
 const user=await getChatGPTUser();if(!user)return children;
 try{const profile=await syncLearnerProfile(user);if(profile.completedAt||await isAdmin())return children;
 const preference=await getDb().select().from(learnerPreferences).where(eq(learnerPreferences.userId,user.userId)).get();
 return <section className="section shell account-page"><span className="section-eyebrow">WELCOME TO LINGOLIVE</span><h1>Let’s set up your learning.</h1><p>Tell us your level, purpose, and country before you start. Your email is <strong>{user.email}</strong>.</p><div className="account-card"><AccountForm current={preference?.translationLanguage} profile={profile}/><a className="text-link" href={chatGPTSignOutPath('/login')}>Use a different account</a></div></section>
 }catch{return <section className="section shell account-page"><h1>Your account is temporarily unavailable</h1><p>Your learner profile could not load. Please try again.</p><a className="button secondary" href="/account">Try again</a></section>}
}

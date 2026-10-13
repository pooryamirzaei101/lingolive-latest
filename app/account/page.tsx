import {eq} from 'drizzle-orm';
import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from '@/app/chatgpt-auth';
import {AccountForm} from '@/components/account-form';
import {getDb} from '@/db';
import {learnerPreferences} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {syncLearnerProfile} from '@/lib/learner-profiles';
import {membership} from '@/lib/membership';
import {isMembershipActive} from '@/lib/payment-rules';
export const dynamic='force-dynamic';
export default async function Account(){
 const user=await getChatGPTUser();
 if(!user)return <section className="section shell account-page"><span className="section-eyebrow">MY ACCOUNT</span><h1>Your English journey starts here.</h1><div className="account-card"><h2>Create an account or sign in</h2><p>Save vocabulary, collect sentences, and keep your learning preferences together.</p><a className="button primary" href={chatGPTSignInPath('/account')} target="_top">Continue with ChatGPT</a><p className="profile-help">Using Gmail? Choose Continue with Google on the sign-in screen. This hosted version uses ChatGPT sign-in; it does not create a separate LingoLive password.</p><a className="text-link" href="/account/recovery">Forgot password or can’t sign in?</a></div><div className="account-card"><h2>Make learning yours.</h2><p>After signing in, choose one of four English levels, your learning purpose, your country, and your translation language.</p><p>Newsletter emails are optional. You can change your choice at any time.</p></div></section>;
 const admin=await isAdmin();let profile,language:string|undefined,plan;
 try{profile=await syncLearnerProfile(user);language=(await getDb().select().from(learnerPreferences).where(eq(learnerPreferences.userId,user.userId)).get())?.translationLanguage;plan=await membership(user.userId)}catch{return <section className="section shell account-page"><h1>My Account</h1><p role="alert">Your profile could not load. Please try again.</p><a className="button secondary" href="/account">Try again</a></section>}
 const active=isMembershipActive(plan?.expiresAt);
 return <section className="section shell account-page"><span className="section-eyebrow">MY ACCOUNT</span><h1>{profile.completedAt?'Your learning, your way.':'Complete your learner profile.'}</h1><div className="account-identity"><div><strong>{user.displayName}</strong><span>{user.email}</span></div><span className="profile-plan-badge">{admin?'Administrator':active?'Premium':'Free'}</span></div><div className="account-card"><AccountForm current={language} profile={profile}/></div><div className="account-card account-links"><a className="button secondary" href="/premium">{active?'View membership':'Explore membership'}</a><a className="button secondary" href="/dashboard">My learning</a><a className="text-link" href="/account/recovery">Password & sign-in help</a>{admin&&<><a className="button secondary" href="/administration/users">Manage Users</a><a className="button secondary" href="/administration">Administration</a></>}<a className="button secondary" href={chatGPTSignOutPath('/login')} target="_top">Sign out</a></div></section>
}

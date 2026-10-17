import {eq} from 'drizzle-orm';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDb} from '@/db';
import {learnerPreferences,learnerProfiles} from '@/db/schema';
import {isTranslationLanguage} from '@/lib/languages';
import {validProfile} from '@/lib/profile-options';
import {syncLearnerProfile} from '@/lib/learner-profiles';
import {confirmSignup} from '@/lib/referrals';
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in before creating a learner profile.'},{status:401});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 try{const body=await request.json() as any;if(!isTranslationLanguage(body?.translationLanguage))return Response.json({error:'Choose a translation language.'},{status:400});
 const full=body.mode==='profile'||['country','level','purpose','newsletterConsent'].some(field=>Object.hasOwn(body,field));
 if(full&&!validProfile(body))return Response.json({error:'Choose your country, English level, and learning purpose, and set your newsletter preference.'},{status:400});
 const db=getDb(),profile=await syncLearnerProfile(user),languageQuery=db.insert(learnerPreferences).values({userId:user.userId,translationLanguage:body.translationLanguage}).onConflictDoUpdate({target:learnerPreferences.userId,set:{translationLanguage:body.translationLanguage}});
 if(full){const now=Date.now(),changedConsent=profile.newsletterConsent!==Number(body.newsletterConsent);await db.batch([languageQuery,db.update(learnerProfiles).set({country:body.country,level:body.level,purpose:body.purpose,newsletterConsent:Number(body.newsletterConsent),newsletterConsentAt:changedConsent?now:profile.newsletterConsentAt,completedAt:profile.completedAt||now,updatedAt:now}).where(eq(learnerProfiles.userId,user.userId))]);await confirmSignup(user.userId)}else await languageQuery;
 return Response.json({ok:true,translationLanguage:body.translationLanguage,completed:full||!!profile.completedAt});
 }catch{return Response.json({error:'Could not save your profile. Please try again.'},{status:500})}
}

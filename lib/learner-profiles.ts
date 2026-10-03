import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {learnerProfiles} from '@/db/schema';
import type {ChatGPTUser} from '@/app/chatgpt-auth';
export async function syncLearnerProfile(user:ChatGPTUser){
 const db=getDb(),now=Date.now();let profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,user.userId)).get();
 if(!profile){await db.insert(learnerProfiles).values({userId:user.userId,email:user.email,displayName:user.displayName,createdAt:now,updatedAt:now,lastSeenAt:now}).onConflictDoNothing();profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,user.userId)).get()}
 if(!profile)throw Error('Your profile could not be created. Please try again.');
 const changedEmail=profile.email!==user.email;
 if(changedEmail||profile.displayName!==user.displayName||now-profile.lastSeenAt>900000){const values={email:user.email,displayName:user.displayName,lastSeenAt:now,...(changedEmail?{newsletterConsent:0,newsletterConsentAt:null}: {})};await db.update(learnerProfiles).set(values).where(eq(learnerProfiles.userId,user.userId));profile={...profile,...values}}
 return profile;
}

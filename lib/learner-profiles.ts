import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {learnerProfiles} from '@/db/schema';
import type {ChatGPTUser} from '@/app/chatgpt-auth';
import {captureNewSignup} from '@/lib/referrals';
export async function syncLearnerProfile(user:ChatGPTUser){
 const db=getDb(),now=Date.now(),email=user.email.trim().toLowerCase();
 let profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,user.userId)).get();
 if(!profile){const inserted=await db.insert(learnerProfiles).values({userId:user.userId,email:user.email,displayName:user.displayName,createdAt:now,updatedAt:now,lastSeenAt:now}).onConflictDoNothing().returning();profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,user.userId)).get();if(inserted.length)await captureNewSignup(user.userId,user.email)}
 if(!profile)throw Error('Your profile could not be created. Please try again.');
 const pending=await db.select().from(learnerProfiles).where(eq(learnerProfiles.pendingEmail,email)).get();
 if(pending?.isPending&&pending.userId!==user.userId){
 // The platform-verified email is the only claim key. Each statement rechecks the pending record.
 // D1 batch moves the grant and removes the placeholder atomically, including concurrent first visits.
 const client=db.$client;
 await client.batch([
 client.prepare("UPDATE learner_profiles SET country=CASE WHEN country='' THEN ? ELSE country END,level=CASE WHEN level='' THEN ? ELSE level END,purpose=CASE WHEN purpose='' THEN ? ELSE purpose END,created_at=MIN(created_at,?),updated_at=? WHERE user_id=? AND EXISTS(SELECT 1 FROM learner_profiles WHERE user_id=? AND is_pending=1 AND pending_email=?)").bind(pending.country,pending.level,pending.purpose,pending.createdAt,now,user.userId,pending.userId,email),
 client.prepare("INSERT INTO premium_grants(user_id,expires_at,granted_by,updated_at) SELECT ?,g.expires_at,g.granted_by,? FROM premium_grants g JOIN learner_profiles p ON p.user_id=g.user_id WHERE p.user_id=? AND p.is_pending=1 AND p.pending_email=? ON CONFLICT(user_id) DO UPDATE SET expires_at=MAX(premium_grants.expires_at,excluded.expires_at),granted_by=excluded.granted_by,updated_at=excluded.updated_at").bind(user.userId,now,pending.userId,email),
 client.prepare("INSERT INTO user_admin_audit(id,actor_id,target_id,action,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM learner_profiles WHERE user_id=? AND is_pending=1 AND pending_email=?)").bind(crypto.randomUUID(),user.userId,user.userId,'pending_account_linked',now,pending.userId,email),
 client.prepare("DELETE FROM premium_grants WHERE user_id=? AND EXISTS(SELECT 1 FROM learner_profiles WHERE user_id=? AND is_pending=1 AND pending_email=?)").bind(pending.userId,pending.userId,email),
 client.prepare("DELETE FROM learner_profiles WHERE user_id=? AND is_pending=1 AND pending_email=?").bind(pending.userId,email),
 ]);
 profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,user.userId)).get();if(!profile)throw Error('Profile could not load.');
 }
 const changedEmail=profile.email!==user.email;
 if(changedEmail||profile.displayName!==user.displayName||now-profile.lastSeenAt>900000){const values={email:user.email,displayName:user.displayName,lastSeenAt:now,...(changedEmail?{newsletterConsent:0,newsletterConsentAt:null}: {})};await db.update(learnerProfiles).set(values).where(eq(learnerProfiles.userId,user.userId));profile={...profile,...values}}
 return profile;
}

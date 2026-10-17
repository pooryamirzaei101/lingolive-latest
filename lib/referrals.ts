import {and,eq,sql} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getDb} from '@/db';
import {learnerProfiles,memberships,premiumGrants,referralCodes,referralEntitlements,referralSignups,referralSettings} from '@/db/schema';
import {addMonths} from '@/lib/payment-rules';

const cookieName='englishfluento_referral';
export {cookieName as referralCookieName};
export async function inviteSettings(){return await getDb().select().from(referralSettings).where(eq(referralSettings.id,'main')).get()||{id:'main',shareText:'Learn English with me on LingoLive!',linkTemplate:'/invite/{code}',updatedAt:0}}

export async function referralCode(userId:string){
 const db=getDb();let row=await db.select().from(referralCodes).where(eq(referralCodes.userId,userId)).get();
 if(!row){const code=Array.from(crypto.getRandomValues(new Uint8Array(12)),n=>n.toString(16).padStart(2,'0')).join('');await db.insert(referralCodes).values({userId,code,createdAt:Date.now()}).onConflictDoNothing();row=await db.select().from(referralCodes).where(eq(referralCodes.userId,userId)).get()}
 if(!row)throw Error('Could not create your invitation link.');return row.code;
}

export async function captureNewSignup(userId:string,email:string){
 const code=(await cookies()).get(cookieName)?.value;
 if(!code||! /^[a-f0-9]{24}$/.test(code))return;
 const db=getDb(),owner=await db.select().from(referralCodes).where(eq(referralCodes.code,code)).get();
 if(!owner||owner.userId===userId)return;
 const inviter=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,owner.userId)).get();
 if(!inviter||inviter.isPending||inviter.email.trim().toLowerCase()===email.trim().toLowerCase())return;
 await db.insert(referralSignups).values({inviteeUserId:userId,inviterUserId:owner.userId,inviteeEmail:email.trim().toLowerCase(),createdAt:Date.now()}).onConflictDoNothing();
}

export async function confirmSignup(userId:string){
 const db=getDb(),profile=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,userId)).get();
 if(!profile?.completedAt||profile.isPending)return;
 const referral=await db.select().from(referralSignups).where(eq(referralSignups.inviteeUserId,userId)).get();
 if(!referral||referral.confirmedAt)return;
 const inviter=await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId,referral.inviterUserId)).get();
 if(!inviter||inviter.email.trim().toLowerCase()===profile.email.trim().toLowerCase())return;
 await db.update(referralSignups).set({confirmedAt:Date.now()}).where(and(eq(referralSignups.inviteeUserId,userId),sql`${referralSignups.confirmedAt} IS NULL`));
 await settleRewards(referral.inviterUserId);
}

export async function referralStats(userId:string){
 await settleRewards(userId);
 const db=getDb(),[count,reward]=await Promise.all([
  db.select({total:sql<number>`count(*)`}).from(referralSignups).where(and(eq(referralSignups.inviterUserId,userId),sql`${referralSignups.confirmedAt} IS NOT NULL`)).get(),
  db.select().from(referralEntitlements).where(eq(referralEntitlements.userId,userId)).get(),
 ]);
 return {confirmed:count?.total||0,monthsEarned:reward?.milestonesGranted||0,expiresAt:reward?.expiresAt||0};
}

async function settleRewards(userId:string){
 const db=getDb();
 const counted=await db.select({total:sql<number>`count(*)`}).from(referralSignups).where(and(eq(referralSignups.inviterUserId,userId),sql`${referralSignups.confirmedAt} IS NOT NULL`)).get();
 const target=Math.floor((counted?.total||0)/10);if(!target)return;
 for(let attempt=0;attempt<4;attempt++){
  const [current,paid,grant]=await Promise.all([
   db.select().from(referralEntitlements).where(eq(referralEntitlements.userId,userId)).get(),
   db.select().from(memberships).where(eq(memberships.userId,userId)).get(),
   db.select().from(premiumGrants).where(eq(premiumGrants.userId,userId)).get(),
  ]);
  const previous=current?.milestonesGranted||0;if(previous>=target)return;
  const now=Date.now(),base=Math.max(now,current?.expiresAt||0,paid?.expiresAt||0,grant?.expiresAt||0);
  const expiresAt=addMonths(base,target-previous);
  if(!current){const inserted=await db.insert(referralEntitlements).values({userId,milestonesGranted:target,expiresAt,updatedAt:now}).onConflictDoNothing().returning();if(inserted.length)return}
  else {const updated=await db.update(referralEntitlements).set({milestonesGranted:target,expiresAt,updatedAt:now}).where(and(eq(referralEntitlements.userId,userId),eq(referralEntitlements.milestonesGranted,previous))).returning();if(updated.length)return}
 }
}

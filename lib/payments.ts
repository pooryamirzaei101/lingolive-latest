import {eq,sql} from 'drizzle-orm';
import {getDb} from '@/db';
import {memberships,paymentOrders} from '@/db/schema';
import {prices,membership} from '@/lib/membership';
import {decryptKey} from '@/lib/media-integrations';
import {addMonths,paymentMatches} from '@/lib/payment-rules';
export async function stripeRequest(path:string,body?:URLSearchParams,idempotencyKey?:string){const config=await prices(),key=await decryptKey(config.stripeKey);if(!key)throw Error('Visa payments are not connected yet.');const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${key}`,'Stripe-Version':'2024-06-20',...(body?{'Content-Type':'application/x-www-form-urlencoded'}:{}),...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},body:body?.toString(),signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('The card payment service is unavailable. Please try again later.');return response.json() as Promise<any>}
export async function iranRequest(action:'request'|'verify',payload:Record<string,unknown>){const config=await prices(),key=await decryptKey(config.merchantKey);if(!key)throw Error('Iranian payments are not connected yet.');const response=await fetch(`https://api.zarinpal.com/pg/v4/payment/${action}.json`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({merchant_id:key,...payload}),signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('The Iranian payment gateway is unavailable. Please try again later.');return response.json() as Promise<any>}
// Claim the pending order inside the same transaction as the membership grant.
// UPDATE locks the order so repeated callbacks cannot apply the payment twice.
export async function grantOrder(id:string,expiry:number,subscriptionId:string|null=null,customerId:string|null=null){
 const db=getDb();
 await db.transaction(async tx=>{
 const [order]=await tx.update(paymentOrders).set({status:'paid',paidAt:Date.now(),expiresAt:expiry}).where(sql`${paymentOrders.id}=${id} AND ${paymentOrders.status}='pending'`).returning();
 if(!order)return;
 if(!Number.isSafeInteger(expiry)||expiry<=Date.now())throw Error('Payment period is invalid.');
 await tx.insert(memberships).values({userId:order.userId,expiresAt:expiry,subscriptionId,customerId}).onConflictDoUpdate({target:memberships.userId,set:{expiresAt:sql`GREATEST(${memberships.expiresAt},${expiry})`,subscriptionId:sql`COALESCE(${subscriptionId},${memberships.subscriptionId})`,customerId:sql`COALESCE(${customerId},${memberships.customerId})`}});
 });
}
export async function verifyCardOrder(sessionId:string){
 const db=getDb(),order=await db.select().from(paymentOrders).where(eq(paymentOrders.providerRef,sessionId)).get();if(!order||order.provider!=='stripe')throw Error('Payment could not be matched to your order.');if(order.status==='paid')return order;
 const session=await stripeRequest(`checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=subscription`);
 if(!paymentMatches(order,session)||session.client_reference_id!==order.id)throw Error('Payment has not been completed.');
 const sub=session.subscription;if(!sub||typeof sub==='string'||!['active','trialing'].includes(sub.status)||sub.metadata?.orderId!==order.id||sub.metadata?.userId!==order.userId||!Number.isFinite(sub.current_period_end))throw Error('Subscription could not be verified.');
 await grantOrder(order.id,sub.current_period_end*1000,sub.id,typeof session.customer==='string'?session.customer:null);return order;
}
export async function verifyIranOrder(orderId:string,authority:string){
 const db=getDb(),order=await db.select().from(paymentOrders).where(eq(paymentOrders.id,orderId)).get();if(!order||order.provider!=='zarinpal'||order.providerRef!==authority)throw Error('Payment could not be matched to your order.');if(order.status==='paid')return order;
 const response=await iranRequest('verify',{amount:order.amount,authority});if(![100,101].includes(response.data?.code)||!response.data?.ref_id)throw Error('The gateway has not confirmed payment.');
 const current=await membership(order.userId),expiry=addMonths(Math.max(Date.now(),current?.expiresAt||0),order.plan==='annual'?12:1);await grantOrder(order.id,expiry);return order;
}

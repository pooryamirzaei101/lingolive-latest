import {eq,sql} from 'drizzle-orm';
import {getDb} from '@/db';
import {memberships} from '@/db/schema';
import {prices} from '@/lib/membership';
import {decryptKey} from '@/lib/media-integrations';
import {verifyStripeSignature} from '@/lib/payment-rules';
import {stripeRequest,verifyCardOrder} from '@/lib/payments';
export async function POST(request:Request){
 const raw=await request.text();if(raw.length>1000000)return new Response('Payload too large',{status:413});
 try{const config=await prices(),secret=await decryptKey(config.webhookKey);if(!secret||!await verifyStripeSignature(raw,request.headers.get('Stripe-Signature')||'',secret))return new Response('Invalid signature',{status:400});
 const event=JSON.parse(raw),object=event.data?.object;if(!object)return new Response('Invalid event',{status:400});
 if(event.type==='checkout.session.completed'&&object.payment_status==='paid')await verifyCardOrder(object.id);
 // Verify a paid invoice directly with Stripe. Its own period end is stable under out-of-order delivery.
 if(event.type==='invoice.paid'){
 const invoice=await stripeRequest(`invoices/${encodeURIComponent(object.id)}`);const subscriptionId=typeof invoice.subscription==='string'?invoice.subscription:invoice.subscription?.id;
 if(invoice.paid&&subscriptionId){const subscription=await stripeRequest(`subscriptions/${encodeURIComponent(subscriptionId)}`),userId=subscription.metadata?.userId;
 if(userId){const expiry=Math.max(0,...(invoice.lines?.data||[]).filter((l:any)=>l.type==='subscription'&&(typeof l.subscription==='string'?l.subscription:l.subscription?.id)===subscriptionId).map((l:any)=>Number(l.period?.end)||0))*1000;
 if(expiry>Date.now()){await verifyCardOrderFromSubscription(subscription);await getDb().update(memberships).set({expiresAt:sql`MAX(${memberships.expiresAt},${expiry})`}).where(eq(memberships.subscriptionId,subscriptionId))}}
 }
 }
 // Cancellation preserves already-paid time. No saved learning data is deleted.
 return Response.json({received:true});
 }catch{return new Response('Payment verification temporarily failed. Retry this event.',{status:503})}
}
async function verifyCardOrderFromSubscription(subscription:any){const db=getDb();const existing=await db.select().from(memberships).where(eq(memberships.subscriptionId,subscription.id)).get();if(existing)return;const {paymentOrders}=await import('@/db/schema');const order=await db.select().from(paymentOrders).where(eq(paymentOrders.id,subscription.metadata?.orderId||'')).get();if(order?.providerRef)await verifyCardOrder(order.providerRef)}

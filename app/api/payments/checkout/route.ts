import {and,eq,gte} from 'drizzle-orm';
import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {getDb} from '@/db';
import {paymentOrders} from '@/db/schema';
import {membership,prices} from '@/lib/membership';
import {isMembershipActive} from '@/lib/payment-rules';
import {stripeRequest,iranRequest} from '@/lib/payments';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const user=await getChatGPTUser();if(!user)return Response.json({signIn:chatGPTSignInPath('/premium'),error:'Sign in before choosing a plan.'},{status:401});
 try{
 const body=await request.json() as any;if(!['iran','international'].includes(body.region)||!['monthly','annual'].includes(body.plan))return Response.json({error:'Choose a membership plan.'},{status:400});
 if(isMembershipActive((await membership(user.userId))?.expiresAt))return Response.json({error:'Your membership is already active. You can renew after it expires or manage your card subscription below.'},{status:409});
 const config=await prices(),iran=body.region==='iran';if(iran?!config.iranEnabled:!config.internationalEnabled)return Response.json({error:iran?'Iranian payments are not connected yet. Please check back soon.':'Visa payments are not connected yet. Please check back soon.'},{status:503});
 const amount=iran?(body.plan==='annual'?config.iranAnnual:config.iranMonthly)*10:(body.plan==='annual'?config.internationalAnnual:config.internationalMonthly);if(!amount)return Response.json({error:'This plan’s price has not been set yet.'},{status:503});
 const db=getDb(),recent=await db.select({id:paymentOrders.id}).from(paymentOrders).where(and(eq(paymentOrders.userId,user.userId),gte(paymentOrders.createdAt,Date.now()-3600000))).limit(5).all();if(recent.length>=5)return Response.json({error:'You have several checkout attempts. Please wait before trying again.'},{status:429});
 const id=crypto.randomUUID(),origin=new URL(request.url).origin,currency=iran?'irr':config.currency;
 await db.insert(paymentOrders).values({id,userId:user.userId,provider:iran?'zarinpal':'stripe',plan:body.plan,amount,currency,createdAt:Date.now()});
 let url:string,reference:string;
 if(iran){const result=await iranRequest('request',{amount,currency:'IRR',description:`LingoLive ${body.plan} membership`,callback_url:`${origin}/api/payments/iran-return?order=${id}`});if(result.data?.code!==100||!/^A[A-Za-z0-9]{10,80}$/.test(result.data?.authority||''))throw Error('The gateway could not open checkout. Please check the merchant configuration.');reference=result.data.authority;url=`https://www.zarinpal.com/pg/StartPay/${reference}`}
 else{
 const form=new URLSearchParams({mode:'subscription','payment_method_types[0]':'card',client_reference_id:id,customer_email:user.email,success_url:`${origin}/api/payments/stripe-return?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/premium?payment=canceled`,'line_items[0][price_data][currency]':currency,'line_items[0][price_data][unit_amount]':String(amount),'line_items[0][price_data][product_data][name]':`LingoLive ${body.plan} membership`,'line_items[0][price_data][recurring][interval]':body.plan==='annual'?'year':'month','line_items[0][quantity]':'1','subscription_data[metadata][orderId]':id,'subscription_data[metadata][userId]':user.userId});
 const session=await stripeRequest('checkout/sessions',form,id);if(typeof session.id!=='string'||typeof session.url!=='string'||new URL(session.url).origin!=='https://checkout.stripe.com')throw Error('The card provider did not return a valid checkout.');reference=session.id;url=session.url;
 }
 await db.update(paymentOrders).set({providerRef:reference}).where(eq(paymentOrders.id,id));return Response.json({url});
 }catch(error){return Response.json({error:error instanceof Error?error.message:'Checkout could not start. Please try again.'},{status:503})}
}

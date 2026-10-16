import Link from 'next/link';
import {syncLearnerProfile} from '@/lib/learner-profiles';
import {and,desc,eq} from 'drizzle-orm';
import {chatGPTSignInPath,getChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin';
import {prices,membership} from '@/lib/membership';
import {isMembershipActive} from '@/lib/payment-rules';
import {MembershipPlans} from '@/components/membership-plans';
import {getDb} from '@/db';
import {paymentOrders} from '@/db/schema';
export const dynamic='force-dynamic';
export default async function Premium({searchParams}:{searchParams:Promise<{payment?:string}>}){
 const user=await getChatGPTUser(),admin=await isAdmin(),config=await prices(),current=user?await membership(user.userId):null,active=isMembershipActive(current?.expiresAt),{payment}=await searchParams;
 const country=user?(await syncLearnerProfile(user)).country:'';
 const history=user?await getDb().select({id:paymentOrders.id,plan:paymentOrders.plan,amount:paymentOrders.amount,currency:paymentOrders.currency,paidAt:paymentOrders.paidAt}).from(paymentOrders).where(and(eq(paymentOrders.userId,user.userId),eq(paymentOrders.status,'paid'))).orderBy(desc(paymentOrders.createdAt)).limit(10).all():[];
 return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">MEMBERSHIP</span><h1>Make English part of every day.</h1><p>Try the free lessons, then unlock the full learning library with one membership.</p></div></section><section className="section shell membership-page">
 {payment==='success'&&active&&<p className="membership-message" role="status">Payment verified. Your membership is ready. Start learning!</p>}{payment==='success'&&!active&&<p className="membership-message" role="status">Sign in with the account used for checkout to view your membership. If payment is still pending, contact the administrator before paying again.</p>}{payment==='canceled'&&<p className="membership-message" role="status">Checkout was canceled. Your account has not changed.</p>}{payment==='unverified'&&<p className="membership-message" role="alert">We could not confirm the payment yet. Do not pay again if your card was charged. Contact the administrator so we can check it.</p>}
 <div className="membership-status"><div><strong>{active?'Your membership is active':current?'Your membership has expired':'Your plan: Free'}</strong><p>{current?`${active?'Access until':'Paid access ended'} ${new Date(current.expiresAt).toLocaleDateString('en-GB',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'})}.`:'Explore the free lessons before choosing a plan.'} Your saved words, sentences, and progress are kept.</p></div><Link className="text-link" href={active?'/video-lessons':'/lessons'}>{active?'Start learning →':'Explore free lessons →'}</Link></div>
 <MembershipPlans prices={config} active={active} signedIn={!!user} hasPortal={!!current?.customerId} initialRegion={country&&country!=='IR'?'international':'iran'} signInUrl={chatGPTSignInPath('/premium')}/>
 {admin&&<div className="membership-admin-link"><strong>Administrator controls</strong><p>Set prices, connect your gateways, and choose which lessons are free.</p><Link className="button secondary" href="/administration/membership">Manage Membership & Payments</Link></div>}
 {history.length>0&&<div className="membership-history"><h2>Your payment history</h2><ul>{history.map(row=><li key={row.id}><span>{row.plan==='annual'?'Annual':'Monthly'} · {new Date(row.paidAt!).toLocaleDateString('en-GB',{timeZone:'UTC'})}</span><strong>{row.currency==='irr'?`${(row.amount/10).toLocaleString('en-US')} toman`:new Intl.NumberFormat('en',{style:'currency',currency:row.currency}).format(row.amount/100)}</strong></li>)}</ul></div>}
 </section></>
}

export const defaultPrices={iranMonthly:400000,iranAnnual:1000000,internationalMonthly:0,internationalAnnual:0,currency:'eur',iranEnabled:0,internationalEnabled:0};
export function iranAnnualMonthlyEquivalent(annual:number){return Math.round(annual/12/1000)*1000}
export function validAmount(value:unknown,allowZero=false){return typeof value==='number'&&Number.isSafeInteger(value)&&value>=(allowZero?0:1)&&value<=1000000000}
export function addMonths(timestamp:number,months:number){const d=new Date(timestamp),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d.getTime()}
export function isMembershipActive(expiresAt:number|undefined,now=Date.now()){return typeof expiresAt==='number'&&expiresAt>now}
export function paymentMatches(order:{amount:number;currency:string;providerRef:string|null},session:any){return session.id===order.providerRef&&session.payment_status==='paid'&&session.status==='complete'&&session.amount_total===order.amount&&session.currency===order.currency&&session.mode==='subscription'}
export async function verifyStripeSignature(raw:string,header:string,secret:string,now=Date.now()){
 const parts=header.split(','),stamp=parts.find(p=>p.startsWith('t='))?.slice(2),signatures=parts.filter(p=>p.startsWith('v1=')).map(p=>p.slice(3));
 if(!stamp||!/^\d+$/.test(stamp)||Math.abs(now/1000-Number(stamp))>300||!signatures.length)return false;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 for(const hex of signatures){if(!/^[a-f0-9]{64}$/i.test(hex))continue;const bytes=Uint8Array.from(hex.match(/../g)!,p=>parseInt(p,16));if(await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(`${stamp}.${raw}`)))return true}return false;
}

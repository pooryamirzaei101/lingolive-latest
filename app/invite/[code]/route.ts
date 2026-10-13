import {eq} from 'drizzle-orm';
import {NextResponse} from 'next/server';
import {getDb} from '@/db';
import {referralCodes} from '@/db/schema';
import {referralCookieName} from '@/lib/referrals';

export async function GET(request:Request,{params}:{params:Promise<{code:string}>}){
 const {code}=await params;
 const destination=new URL('/account',request.url);
 if(!/^[a-f0-9]{24}$/.test(code))return NextResponse.redirect(destination);
 const found=await getDb().select().from(referralCodes).where(eq(referralCodes.code,code)).get();
 if(!found)return NextResponse.redirect(destination);
 const response=NextResponse.redirect(destination);
 response.cookies.set(referralCookieName,code,{httpOnly:true,secure:destination.protocol==='https:',sameSite:'lax',path:'/',maxAge:30*24*60*60});
 return response;
}

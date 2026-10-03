import Link from 'next/link';
import {isAdmin} from '@/lib/admin';
import {MembershipAdmin} from '@/components/membership-admin';
export const dynamic='force-dynamic';
export default async function PaymentAdmin(){if(!await isAdmin())return <section className="section shell"><h1>Administrator access required</h1><Link href="/">Go home</Link></section>;return <section className="section shell admin-page"><Link href="/administration" className="folder-back">← Administration</Link><span className="section-eyebrow">MEMBERSHIP & PAYMENTS</span><h1>Your plans. Your payment options.</h1><p>Manage regional prices and secure gateway connections. No service is purchased or activated automatically.</p><MembershipAdmin/></section>}

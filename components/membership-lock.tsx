import Link from 'next/link';
import {LockKeyhole} from 'lucide-react';
export function MembershipLock(){return <section className="section shell"><div className="empty-state"><LockKeyhole size={32}/><h1>Continue with Membership</h1><p>This lesson is included in your membership. Choose a plan to unlock the full learning library.</p><p>Your saved words, sentences, and progress stay safe.</p><Link href="/premium" className="button primary">View membership plans</Link><Link href="/lessons" className="button secondary">Explore free lessons</Link></div></section>}

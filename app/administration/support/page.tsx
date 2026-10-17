import {isAdmin} from '@/lib/admin';
import {SupportDesk} from '@/components/support-desk';
export const dynamic='force-dynamic';
export default async function Inbox(){if(!await isAdmin())return <section className="section shell"><h1>Administrator access required</h1><a href="/support">Contact Admin</a></section>;return <section className="section shell support-page"><a href="/administration">← Administration</a><span className="section-eyebrow">PRIVATE SUPPORT</span><h1>Support inbox</h1><p>Read student questions, send replies, and manage request status.</p><SupportDesk admin/></section>}

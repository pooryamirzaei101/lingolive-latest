import {getChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin';
import {SupportDesk} from '@/components/support-desk';
export const dynamic='force-dynamic';
export default async function Support(){const user=await getChatGPTUser(),admin=await isAdmin();return <section className="section shell support-page"><span className="section-eyebrow">HELP & SUPPORT</span><h1>Contact Admin</h1><p>Ask a question, report a lesson problem, and read private replies.</p>{admin&&<a className="button secondary" href="/administration/support">Open administrator inbox</a>}{user?<SupportDesk/>:<><p>Sign in to send and view private support requests.</p><a className="button primary" href="/account">Sign in / Register</a></>}</section>}

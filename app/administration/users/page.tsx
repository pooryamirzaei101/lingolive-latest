import Link from 'next/link';
import {isAdmin} from '@/lib/admin';
import {UsersAdmin} from '@/components/users-admin';
export const dynamic='force-dynamic';
export default async function Users(){if(!await isAdmin())return <section className="section shell"><h1>Administrator access required</h1><p>Only the site administrator can view user records.</p><Link className="button secondary" href="/">Go home</Link></section>;return <section className="section shell admin-page users-page"><Link className="folder-back" href="/administration">← Administration</Link><span className="section-eyebrow">ADMINISTRATION · USERS</span><h1>Know your learners.</h1><p>View account emails, countries, English levels, learning purposes, and membership. These records are private to the administrator.</p><UsersAdmin/></section>}

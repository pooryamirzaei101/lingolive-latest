import {YouTubeConnection} from "@/components/youtube-connection";
import {isAdmin} from '@/lib/admin';
import {MediaApiSettings} from '@/components/media-api-settings';
export const dynamic='force-dynamic';
export default async function Page(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>Only the administrator can manage API connections.</p></section>;return <section className="section shell admin-page"><a href="/administration/videos">← Video & News studio</a><h1>Media API connections</h1><MediaApiSettings/><YouTubeConnection/></section>}

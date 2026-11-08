import { YouTubeConnection } from "@/components/youtube-connection";
import { MediaApiSettings } from "@/components/media-api-settings";
import { isAdmin } from "@/lib/admin";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!await isAdmin()) return <section className="section shell"><h1>Administration</h1><p>Only the administrator can manage API connections.</p></section>;
  return <section className="section shell admin-page settings-page">
    <a className="folder-back" href="/administration">← Administration</a>
    <span className="section-eyebrow">ADMINISTRATION</span>
    <h1>API connections</h1>
    <p>Manage transcription, translation, and YouTube caption access in one place. Saved lessons remain available when API generation is disabled.</p>
    <nav className="admin-actions" aria-label="API settings sections">
      <a className="button secondary" href="#generation-settings">Transcription & translation</a>
      <a className="button secondary" href="#youtube-settings">YouTube connection</a>
      <a className="button primary" href="/administration/youtube#add-content">Add a YouTube video</a>
    </nav>
    <section id="generation-settings" className="detail-panel"><MediaApiSettings /></section>
    <section id="youtube-settings"><YouTubeConnection /></section>
  </section>;
}

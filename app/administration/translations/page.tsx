import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { translationServiceConnected } from "@/lib/translation-service";
import { TranslationServiceStatus } from "@/components/translation-service-status";
export const dynamic="force-dynamic";
export default async function TranslationAdministration(){
  if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  return <section className="section shell admin-page"><Link className="folder-back" href="/administration">← Administration</Link><span className="section-eyebrow">ADMINISTRATION</span><h1>Translation connection</h1><TranslationServiceStatus connected={translationServiceConnected()}/><p>Reviewed Persian word meanings and existing saved translations remain available if a translation service is offline. Students can choose a language in their account settings; the live service can be connected later without changing lesson content.</p></section>
}

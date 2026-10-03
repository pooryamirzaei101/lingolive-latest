import Link from "next/link";
import { IeltsReadingSample } from "@/components/ielts-reading-sample";
import { isSampleHidden } from "@/lib/sample-visibility";
import { notFound } from "next/navigation";

export default async function IeltsSamplePage(){if(await isSampleHidden("sample-reading"))notFound();return <section className="section shell catalog-page">
  <Link className="folder-back" href="/ielts-examples/categories/ielts-reading">← Back to Reading</Link>
  <span className="section-eyebrow">IELTS EXAMPLES · SHORT PRACTICE</span>
  <h1>Read a Library Notice</h1>
  <p>A short example with two questions. Read at your own pace and check your answers.</p>
  <IeltsReadingSample/>
</section>}

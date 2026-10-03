import Link from "next/link";
import { BookOpen, Captions, FileText, Lightbulb, Mic, MonitorPlay, PlayCircle, Settings2 } from "lucide-react";
import { isAdmin } from "@/lib/admin";
export const dynamic="force-dynamic";
const studios=[
  {href:"/administration/videos",title:"Video Lessons & News",description:"Upload standard or vertical videos, arrange folders, and edit transcripts and translations.",icon:MonitorPlay},
  {href:"/administration/routines",title:"Daily Lessons",description:"Write phrases, examples, explanations, and lesson text; attach narration.",icon:Captions},
  {href:"/administration/youtube",title:"YouTube Videos",description:"Add video or Shorts links with reviewed English and Persian lesson text.",icon:PlayCircle},
  {href:"/administration/ielts",title:"IELTS Examples",description:"Create question folders, model answers, translations, and audio.",icon:FileText},
  {href:"/administration/reading",title:"Reading Room",description:"Create text chapters, attach PDFs, and organize reading folders.",icon:BookOpen},
  {href:"/administration/speaking",title:"Speaking Practice",description:"Upload speaking videos and arrange practice categories.",icon:Mic},
  {href:"/administration/quick-tips",title:"Quick Tips",description:"Create short audio and text tips with examples and translations.",icon:Lightbulb},
  {href:"/administration/translations",title:"Translation connection",description:"Check the optional live translation service connection.",icon:Settings2},
];
export default async function Administration(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><Link href="/">Go home</Link></section>;
  return <section className="section shell admin-page admin-hub"><span className="section-eyebrow">ADMINISTRATION</span><h1>Manage your lessons</h1><p>Choose a studio to add folders and content. Drafts stay private until you publish them.</p><nav className="admin-studio-grid" aria-label="Content studios">{studios.map(studio=><Link className="admin-studio-card" href={studio.href} key={studio.href}><span className="admin-studio-icon"><studio.icon size={23}/></span><strong>{studio.title}</strong><span>{studio.description}</span><span className="text-link">Open studio</span></Link>)}</nav></section>
}

import { BookOpen, FileText, Captions, Layers3, Lightbulb, Mic, MonitorPlay, PlayCircle, Settings2, Users, SquarePlay } from "lucide-react";
import { isAdmin } from "@/lib/admin";
export const dynamic="force-dynamic";
const studios=[
  {href:"/administration/support",title:"Support inbox",description:"Reply privately to students and resolve support requests.",icon:Users},
  {href:"/administration/users",title:"Users",description:"View learner emails, countries, levels, purposes, membership, and newsletter preferences.",icon:Users},
  {href:"/administration/membership",title:"Membership & Payments",description:"Set Iran and international prices, connect gateways, and manage free lesson access.",icon:Settings2},
  {href:"/administration/media-apis",title:"Media API connections",description:"Securely connect transcription and multilingual translation providers; test before enabling.",icon:Settings2},
  {href:"/administration/videos",title:"Video Lessons & News",description:"Upload standard or vertical videos, arrange folders, and edit transcripts and translations.",icon:MonitorPlay},
  {href:"/administration/youtube",title:"YouTube Lessons",description:"Add YouTube URLs, import or generate timed English transcripts, and prepare translations.",icon:SquarePlay},
  {href:"/administration/routines",title:"Daily Lessons",description:"Write phrases, examples, explanations, and lesson text; attach narration.",icon:Captions},
  {href:"/administration/podcasts",title:"Podcasts",description:"Upload audio or video podcasts and review timed English subtitles.",icon:PlayCircle},
  {href:"/administration/flashcards",title:"Flashcards",description:"Write or paste a phrase, add an example or explanation, and upload voice.",icon:Layers3},
  {href:"/administration/ielts-listening-reading",title:"IELTS Listening & Reading",description:"Create audio and reading lessons with reviewed transcripts.",icon:FileText},
  {href:"/administration/ielts-video-speaking",title:"IELTS Video Speaking",description:"Manage video speaking lessons and teleprompter scripts.",icon:MonitorPlay},
  {href:"/administration/reading",title:"Reading Room",description:"Create text chapters, attach PDFs, and organize reading folders.",icon:BookOpen},
  {href:"/administration/speaking",title:"Speaking Practice",description:"Upload speaking videos and arrange practice categories.",icon:Mic},
  {href:"/administration/quick-tips",title:"Quick Tips",description:"Create short audio and text tips with examples and translations.",icon:Lightbulb},
  {href:"/administration/translations",title:"Translation connection",description:"Check the optional live translation service connection.",icon:Settings2},
];
export default async function Administration(){if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the site administrator.</p><a href="/">Go home</a></section>;
  return <section className="section shell admin-page admin-hub"><span className="section-eyebrow">ADMINISTRATION</span><h1>Manage your lessons</h1><p>Choose a studio to add folders and content. Drafts stay private until you publish them.</p><nav className="admin-studio-grid" aria-label="Content studios">{studios.map(studio=><a className="admin-studio-card" href={studio.href} key={studio.href}><span className="admin-studio-icon"><studio.icon size={23}/></span><strong>{studio.title}</strong><span>{studio.description}</span><span className="text-link">Open studio</span></a>)}</nav></section>
}

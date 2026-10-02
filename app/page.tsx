import Link from "next/link";
import { ArrowRight, Clapperboard, BookOpen, Mic2, NotebookTabs, GraduationCap, CalendarDays } from "lucide-react";
import { lessons } from "@/lib/content";
const sections=[
  {title:"Video Lessons",text:"Learn from videos with timed subtitles and transcripts.",href:"/video-lessons",icon:Clapperboard},
  {title:"Daily Lessons",text:"Short reading and listening practice.",href:"/daily-lessons",icon:CalendarDays},
  {title:"Reading Room",text:"Stories and articles for every level.",href:"/reading-room",icon:BookOpen},
  {title:"Speaking Practice",text:"Practice saying English out loud.",href:"/speaking-practice",icon:Mic2},
  {title:"Word Bank",text:"Build a personal vocabulary collection.",href:"/word-bank",icon:NotebookTabs},
  {title:"IELTS Examples",text:"Prepare across the four IELTS skills.",href:"/ielts-examples",icon:GraduationCap},
];
export default function Home(){return <section className="section shell home-workspace"><span className="section-eyebrow">WELCOME TO ENGLISHFLUENTO</span><h1>What will you learn today?</h1><p>Choose a lesson or explore a learning area. Start small and keep going.</p><div className="home-feature"><div><span className="section-eyebrow">CONTINUE LEARNING</span><h2>{lessons[0].title}</h2><p>{lessons[0].description}</p><Link className="button primary" href={`/lessons/${lessons[0].slug}`}>Open lesson <ArrowRight size={18}/></Link></div><div className="home-feature-icon"><Clapperboard size={60}/></div></div><div className="section-head"><div><h2>Explore your learning space</h2><p>Each section has a clear place as we add more lessons and tools.</p></div></div><div className="home-section-grid">{sections.map(({title,text,href,icon:Icon})=><Link className="home-section-card" href={href} key={href}><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p><ArrowRight size={17}/></Link>)}</div><div className="home-next"><h2>Your learning progress</h2><p>Saved and completed lessons on this device are shown in your dashboard.</p><Link className="button secondary" href="/dashboard">Open dashboard</Link></div></section>}

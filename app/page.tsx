import { ArrowRight, Clapperboard, BookOpen, Mic2, NotebookTabs, CalendarDays, Newspaper, Headphones, Layers3, GraduationCap, SquarePlay } from "lucide-react";
import { getRoutine } from "@/lib/routines";
const sections=[
  {title:"Video Lessons",text:"Learn from videos with timed subtitles and transcripts.",href:"/video-lessons",icon:Clapperboard},
  {title:"YouTube Lessons",text:"Watch approved videos with synchronized English and translated subtitles.",href:"/youtube-videos",icon:SquarePlay},
  {title:"Flashcards",text:"Hear a short phrase, read an example, and save useful words.",href:"/flashcards",icon:Layers3},
  {title:"Podcasts",text:"Listen or watch with English subtitles and vocabulary practice.",href:"/podcasts",icon:Headphones},
  {title:"News",text:"Explore news videos by topic as they are published.",href:"/news",icon:Newspaper},
  {title:"Daily Lessons",text:"Short reading and listening practice.",href:"/daily-lessons",icon:CalendarDays},
  {title:"Reading Room",text:"Stories and articles for every level.",href:"/reading-room",icon:BookOpen},
  {title:"Speaking Practice",text:"Practice saying English out loud.",href:"/speaking-practice",icon:Mic2},
  {title:"IELTS Listening & Reading",text:"Audio, reading passages, and interactive transcripts.",href:"/ielts-listening-reading",icon:Headphones},
  {title:"IELTS Video Speaking",text:"Watch model answers and record your own.",href:"/ielts-video-speaking",icon:GraduationCap},
  {title:"Word Bank",text:"Build a personal vocabulary collection.",href:"/word-bank",icon:NotebookTabs},
];
export const dynamic="force-dynamic";
export default async function Home(){let routine;try{routine=await getRoutine("morning-routine")}catch{};const featured=routine?.status==="published"?routine:null;return <section className="section shell home-workspace"><span className="section-eyebrow">WELCOME TO LINGOLIVE</span><h1>What will you learn today?</h1><p>Choose a lesson or explore a learning area. Start small and keep going.</p>{featured&&<div className="home-feature"><div><span className="section-eyebrow">FEATURED DAILY LESSON</span><h2>{featured.title}</h2><p>Today’s phrase: <strong>{featured.phrase}</strong>. {featured.explanation}</p><a className="button primary" href={`/daily-lessons/routines/${featured.id}`}>Open lesson <ArrowRight size={18}/></a></div><div className="home-feature-icon"><BookOpen size={60}/></div></div>}<div className="section-head"><div><h2>Explore your learning space</h2><p>Each section has a clear place as we add more lessons and tools.</p></div></div><div className="home-section-grid">{sections.map(({title,text,href,icon:Icon})=><a className="home-section-card" href={href} key={href}><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p><ArrowRight size={17}/></a>)}</div><div className="home-next"><h2>Your learning progress</h2><p>Saved and completed lessons on this device are shown in your dashboard.</p><a className="button secondary" href="/dashboard">Open dashboard</a></div></section>}

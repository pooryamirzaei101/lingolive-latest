import Link from "next/link";
import {ArrowRight,Clapperboard,BookOpen,Mic2,NotebookTabs,Newspaper,Headphones,Layers3,GraduationCap,SquarePlay,CalendarDays,PlayCircle,AudioLines} from "lucide-react";
import {getRoutine} from "@/lib/routines";

const sections=[
  {title:"Video Lessons",text:"Learn from videos with timed subtitles and transcripts.",href:"/video-lessons",icon:Clapperboard},
  {title:"YouTube Lessons",text:"Watch approved videos with synchronized subtitles.",href:"/youtube-videos",icon:SquarePlay},
  {title:"Flashcards",text:"Hear useful phrases and save new words.",href:"/flashcards",icon:Layers3},
  {title:"News",text:"Explore English news videos by topic.",href:"/news",icon:Newspaper},
  {title:"Reading Room",text:"Read stories and articles for every level.",href:"/reading-room",icon:BookOpen},
  {title:"IELTS Practice",text:"Build listening, reading, and speaking confidence.",href:"/ielts-listening-reading",icon:GraduationCap},
  {title:"Word Bank",text:"Review your personal vocabulary collection.",href:"/word-bank",icon:NotebookTabs},
];

export const dynamic="force-dynamic";

export default async function Home(){
  let routine;
  try{routine=await getRoutine("morning-routine")}catch{}
  const featured=routine?.status==="published"?routine:null;
  return <section className="section shell home-workspace fresh-home">
    <div className="fresh-welcome"><span className="section-eyebrow">WELCOME TO LINGOLIVE</span><h1>Grow your English, one calm step at a time.</h1><p>Choose a short lesson, listen carefully, and practise with confidence.</p></div>
    <Link className="daily-lesson-gateway" href="/daily-lessons">
      <div className="daily-gateway-copy"><span className="fresh-card-icon"><CalendarDays size={25}/></span><span className="section-eyebrow">DAILY LESSONS</span><h2>Tap to see today’s lessons</h2><p>Open quick reading, listening, and everyday English practice made for your daily routine.</p><span className="fresh-card-action">Explore daily lessons <ArrowRight size={18}/></span></div>
      <div className="daily-gateway-art" aria-hidden="true"><span>HELLO</span><strong>Learn a little<br/>every day.</strong><BookOpen size={54}/></div>
    </Link>
    {featured&&<div className="fresh-featured"><div><span className="section-eyebrow">TODAY’S QUICK START</span><h2>{featured.title}</h2><p>Today’s phrase: <strong>{featured.phrase}</strong>. {featured.explanation}</p></div><Link className="button primary" href={`/daily-lessons/routines/${featured.id}`}>Start lesson <PlayCircle size={18}/></Link></div>}
    <div className="section-head fresh-section-head"><div><span className="section-eyebrow">KEEP LEARNING</span><h2>Listen, then speak</h2><p>Two focused ways to build real-world English skills.</p></div></div>
    <div className="home-focus-grid">
      <Link className="home-focus-card podcast-focus" href="/podcasts"><span className="focus-badge"><Headphones size={20}/> LISTEN</span><div><AudioLines size={48}/><h2>Podcast Lessons</h2><p>Listen with English subtitles, tap new vocabulary, and learn at your pace.</p><span>Browse podcasts <ArrowRight size={18}/></span></div></Link>
      <Link className="home-focus-card speaking-focus" href="/speaking-practice"><span className="focus-badge"><Mic2 size={20}/> SPEAK</span><div><Mic2 size={48}/><h2>Speaking Practice</h2><p>Record your voice, repeat useful phrases, and become more confident.</p><span>Start speaking <ArrowRight size={18}/></span></div></Link>
    </div>
    <div className="section-head fresh-section-head"><div><span className="section-eyebrow">EXPLORE MORE</span><h2>Your learning space</h2></div></div>
    <div className="home-section-grid">{sections.map(({title,text,href,icon:Icon})=><Link className="home-section-card" href={href} key={href}><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p><ArrowRight size={17}/></Link>)}</div>
    <div className="home-next"><h2>Your learning progress</h2><p>Review saved and completed lessons in your dashboard.</p><Link className="button secondary" href="/dashboard">Open dashboard</Link></div>
  </section>;
}

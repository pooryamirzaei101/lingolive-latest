import Link from "next/link";
import {ArrowRight,Clapperboard,BookOpen,Mic2,NotebookTabs,Newspaper,Headphones,Layers3,GraduationCap,SquarePlay,CalendarDays,AudioLines} from "lucide-react";

const sections=[
  {title:"YouTube Lessons",text:"Watch approved videos with synchronized subtitles.",href:"/youtube-videos",icon:SquarePlay},
  {title:"Flashcards",text:"Hear useful phrases and save new words.",href:"/flashcards",icon:Layers3},
  {title:"News",text:"Explore English news videos by topic.",href:"/news",icon:Newspaper},
  {title:"Reading Room",text:"Read stories and articles for every level.",href:"/reading-room",icon:BookOpen},
  {title:"IELTS Practice",text:"Build listening, reading, and speaking confidence.",href:"/ielts-listening-reading",icon:GraduationCap},
  {title:"Word Bank",text:"Review your personal vocabulary collection.",href:"/word-bank",icon:NotebookTabs},
];

export const dynamic="force-dynamic";

export default async function Home(){
  return <section className="section shell home-workspace fresh-home">
    <div className="fresh-welcome"><span className="section-eyebrow">WELCOME TO LINGOLIVE</span><h1>Grow your English, one calm step at a time.</h1><p>Choose a short lesson, listen carefully, and practise with confidence.</p></div>
    <div className="section-head fresh-section-head"><div><span className="section-eyebrow">START HERE</span><h2>Choose today’s practice</h2><p>Four focused ways to study, all in one place.</p></div></div>
    <div className="home-focus-grid four-up">
      <Link className="home-focus-card daily-focus" href="/daily-lessons"><span className="focus-badge"><CalendarDays size={18}/> DAILY</span><div><CalendarDays size={38}/><h2>Daily Lessons</h2><p>Short reading, listening, and everyday English.</p><span>See lessons <ArrowRight size={16}/></span></div></Link>
      <Link className="home-focus-card speaking-focus" href="/speaking-practice"><span className="focus-badge"><Mic2 size={18}/> SPEAK</span><div><Mic2 size={38}/><h2>Speaking Practice</h2><p>Record your voice and build confidence.</p><span>Start speaking <ArrowRight size={16}/></span></div></Link>
      <Link className="home-focus-card podcast-focus" href="/podcasts"><span className="focus-badge"><Headphones size={18}/> LISTEN</span><div><AudioLines size={38}/><h2>Podcast Lessons</h2><p>Listen with subtitles and tap new words.</p><span>Browse podcasts <ArrowRight size={16}/></span></div></Link>
      <Link className="home-focus-card video-focus" href="/video-lessons"><span className="focus-badge"><Clapperboard size={18}/> WATCH</span><div><Clapperboard size={38}/><h2>Video Lessons</h2><p>Watch with transcripts and vocabulary.</p><span>See videos <ArrowRight size={16}/></span></div></Link>
    </div>
    <div className="section-head fresh-section-head"><div><span className="section-eyebrow">EXPLORE MORE</span><h2>Your learning space</h2></div></div>
    <div className="home-section-grid">{sections.map(({title,text,href,icon:Icon})=><Link className="home-section-card" href={href} key={href}><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p><ArrowRight size={17}/></Link>)}</div>
    <div className="home-next"><h2>Your learning progress</h2><p>Review saved and completed lessons in your dashboard.</p><Link className="button secondary" href="/dashboard">Open dashboard</Link></div>
  </section>;
}

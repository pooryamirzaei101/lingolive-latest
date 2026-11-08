import { ArrowRight, Clapperboard, BookOpen, Mic2, NotebookTabs, CalendarDays, Newspaper, Headphones, Layers3, GraduationCap, SquarePlay } from "lucide-react";
import { LessonThumbnail } from "@/components/lesson-thumbnail";
import { ScrollReveal } from "@/components/scroll-reveal";
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
export default async function Home() {
  let routine;
  try { routine = await getRoutine("morning-routine"); } catch {}
  const featured = routine?.status === "published" ? routine : null;
  return <section className="section shell home-workspace">
    <header className="home-intro">
      <span className="section-eyebrow">WELCOME TO LINGOLIVE</span>
      <h1>A little practice. Every day.</h1>
      <p>Build your confidence, one conversation at a time.</p>
    </header>
    <div className="daily-lesson-card">
      <LessonThumbnail kind="lesson" />
      <div className="daily-lesson-copy">
        <span className="section-eyebrow">{featured ? "TODAY’S LESSON" : "YOUR DAILY LESSON"}</span>
        <h2>{featured?.title ?? "Make room for a little English"}</h2>
        <p>{featured ? <>Today’s phrase: <strong>{featured.phrase}</strong>. {featured.explanation}</> : "Find a short reading or listening lesson and take your next small step."}</p>
        <span className="daily-lesson-note"><CalendarDays size={16} aria-hidden="true" />Reading & listening practice</span>
      </div>
      <a className="button primary daily-lesson-action" href={featured ? `/daily-lessons/routines/${featured.id}` : "/daily-lessons"}>Start lesson <ArrowRight size={18} aria-hidden="true" /></a>
    </div>
    <section className="home-practice" aria-labelledby="practice-heading">
      <div className="section-head"><div><h2 id="practice-heading">Keep your momentum</h2><p>A little listening. A little speaking. A little more confidence.</p></div></div>
      <ScrollReveal><div className="practice-card-grid">
        <a href="/podcasts" className="practice-card practice-card--podcast">
          <LessonThumbnail kind="podcast" />
          <div className="practice-card-copy"><h3>Podcasts</h3><p>Learn by listening.</p><span className="button primary"><Headphones size={18} aria-hidden="true" />Listen now <ArrowRight size={18} aria-hidden="true" /></span></div>
        </a>
        <a href="/speaking-practice" className="practice-card practice-card--speaking">
          <LessonThumbnail kind="speaking" />
          <div className="practice-card-copy"><h3>Speaking Practice</h3><p>Find your voice. Build confidence.</p><span className="button peach">Start speaking <ArrowRight size={18} aria-hidden="true" /></span></div>
        </a>
      </div></ScrollReveal>
    </section>
    <div className="section-head"><div><h2>Explore your learning space</h2><p>Find your next lesson, discover a story, or build your vocabulary.</p></div></div>
    <div className="home-section-grid">{sections.filter(({ href }) => !["/podcasts", "/speaking-practice", "/daily-lessons"].includes(href)).map(({title,text,href,icon:Icon}) => <a className="home-section-card" href={href} key={href}><span><Icon size={23} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p><ArrowRight size={17} aria-hidden="true" /></a>)}</div>
    <div className="home-next"><div><h2>Your learning progress</h2><p>Saved and completed lessons on this device are shown in your dashboard.</p></div><a className="button secondary" href="/dashboard">Open dashboard <ArrowRight size={18} aria-hidden="true" /></a></div>
  </section>;
}

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clapperboard,
  GraduationCap,
  Headphones,
  Layers3,
  Mic2,
  Newspaper,
  NotebookTabs,
  Sparkles,
  SquarePlay,
} from "lucide-react";
import { getRoutine } from "@/lib/routines";

const exploreSections = [
  { title: "Reading Room", text: "Stories and articles for every level.", href: "/reading-room", icon: BookOpen },
  { title: "Flashcards", text: "Review useful words and phrases.", href: "/flashcards", icon: Layers3 },
  { title: "YouTube Lessons", text: "Learn with subtitles and transcripts.", href: "/youtube-videos", icon: SquarePlay },
  { title: "English News", text: "Build confidence with current topics.", href: "/news", icon: Newspaper },
  { title: "IELTS Practice", text: "Listening and reading practice in one place.", href: "/ielts-listening-reading", icon: GraduationCap },
  { title: "Word Bank", text: "Keep your personal vocabulary collection.", href: "/word-bank", icon: NotebookTabs },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  let routine;
  try {
    routine = await getRoutine("morning-routine");
  } catch {
    // Keep the homepage available when the local database is offline.
  }

  const featured = routine?.status === "published" ? routine : null;
  const dailyLessonHref = featured ? `/daily-lessons/routines/${featured.id}` : "/daily-lessons";

  return (
    <main className="section shell strawberry-home">
      <header className="strawberry-hero">
        <div className="strawberry-hero-copy">
          <span className="strawberry-kicker"><Sparkles size={16} /> Your daily English space</span>
          <h1>Make English part of your day.</h1>
          <p>Read, watch, listen, and speak with short activities made for steady progress.</p>
        </div>
        <a className="today-plan news-hero-card" href="/news" aria-label="Open English News lessons">
          <span className="home-card-icon"><Newspaper size={25} /></span>
          <div><strong>English News</strong><small>Build confidence with current topics.</small></div>
          <span className="news-hero-action">See lessons <ArrowRight size={17} /></span>
        </a>
      </header>

      <section className="home-learning-section" aria-labelledby="start-heading">
        <div className="home-section-heading"><span>Start here</span><h2 id="start-heading">Pick today’s practice</h2></div>
        <div className="home-primary-grid">
          <a className="home-learning-card daily-learning-card" href={dailyLessonHref}>
            <span className="home-card-icon"><CalendarDays size={28} /></span>
            <div><span className="home-card-label">A little every day</span><h3>Daily Lessons</h3><p>{featured ? `${featured.title}: ${featured.phrase}` : "A short reading and listening activity for today."}</p></div>
            <span className="home-card-action">Start daily lesson <ArrowRight size={18} /></span>
          </a>
          <a className="home-learning-card video-learning-card" href="/video-lessons">
            <span className="home-card-icon"><Clapperboard size={28} /></span>
            <div><span className="home-card-label">Watch and understand</span><h3>Video Lessons</h3><p>Learn naturally with helpful subtitles and transcripts.</p></div>
            <span className="home-card-action">Watch a lesson <ArrowRight size={18} /></span>
          </a>
        </div>
      </section>

      <section className="home-learning-section" aria-labelledby="practice-heading">
        <div className="home-section-heading"><span>Keep going</span><h2 id="practice-heading">Practice with your voice and ears</h2></div>
        <div className="home-practice-grid">
          <a className="home-practice-card speaking-card" href="/speaking-practice">
            <span className="home-card-icon"><Mic2 size={25} /></span>
            <div><h3>Speaking Practice</h3><p>Repeat useful phrases and build confidence out loud.</p></div>
            <span className="home-card-action">Start speaking <ArrowRight size={17} /></span>
          </a>
          <a className="home-practice-card podcast-card" href="/podcasts">
            <span className="home-card-icon"><Headphones size={25} /></span>
            <div><h3>Podcasts</h3><p>Listen at your pace with subtitles and vocabulary support.</p></div>
            <span className="home-card-action">Start listening <ArrowRight size={17} /></span>
          </a>
        </div>
      </section>

      <section className="home-learning-section" aria-labelledby="explore-heading">
        <div className="home-section-heading"><span>More ways to learn</span><h2 id="explore-heading">Explore LingoLive</h2></div>
        <div className="home-explore-grid">
          {exploreSections.map(({ title, text, href, icon: Icon }) => (
            <a className="home-explore-card" href={href} key={href}>
              <span><Icon size={21} /></span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="home-explore-arrow" size={17} />
            </a>
          ))}
        </div>
      </section>

      <aside className="home-progress-card">
        <div><span>Your learning journey</span><h2>Small steps become real progress.</h2><p>See the lessons you saved and completed on this device.</p></div>
        <a className="button strawberry-secondary" href="/dashboard">Open dashboard <ArrowRight size={18} /></a>
      </aside>
    </main>
  );
}

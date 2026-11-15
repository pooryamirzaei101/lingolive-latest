import { notFound } from "next/navigation";
import { BookOpen, Captions, FileText, Layers3, Lightbulb, Mic, MonitorPlay, PlayCircle, Settings2, SquarePlay, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const studios = [
  ["All-section media studio", "Videos, podcasts, transcripts, and translations.", MonitorPlay],
  ["Support inbox", "Student support requests and reply controls.", Users],
  ["Users", "Learner profiles and membership controls.", Users],
  ["Membership & Payments", "Pricing, gateways, and lesson access.", Settings2],
  ["Media API connections", "Transcription and translation providers.", Settings2],
  ["Video Lessons & News", "Video folders, drafts, and publishing.", MonitorPlay],
  ["YouTube Lessons", "YouTube imports and timed transcripts.", SquarePlay],
  ["Daily Lessons", "Phrases, examples, and narration.", Captions],
  ["Podcasts", "Audio uploads and subtitle review.", PlayCircle],
  ["Flashcards", "Phrase, example, and voice controls.", Layers3],
  ["IELTS Listening & Reading", "IELTS lesson and transcript controls.", FileText],
  ["Reading Room", "Chapters, PDFs, pictures, and folders.", BookOpen],
  ["Speaking Practice", "Speaking videos and categories.", Mic],
  ["Quick Tips", "Short audio and text-tip controls.", Lightbulb],
] as const;

export default function AdministrationPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return <section className="section shell admin-page admin-hub">
    <span className="section-eyebrow">LOCAL DEMONSTRATION</span>
    <h1>Administration preview</h1>
    <p className="notice">Safe sample view only. Private data is not loaded and all administration actions are disabled.</p>
    <div className="admin-studio-grid">{studios.map(([title, description, Icon]) =>
      <article className="admin-studio-card" key={title}>
        <span className="admin-studio-icon"><Icon size={23}/></span>
        <strong>{title}</strong><span>{description}</span>
        <span className="text-link" aria-disabled="true">Preview only</span>
      </article>
    )}</div>
  </section>;
}

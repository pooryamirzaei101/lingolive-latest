import { LessonPlayer } from "@/components/lesson-player";
import { lessons } from "@/lib/content";
import { SectionFolderCatalog } from "@/components/section-folder-catalog";

const sample = lessons.find((lesson) => lesson.slug === "daily-small-steps")!;

export const dynamic="force-dynamic";
export default function DailyLessonsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="section-eyebrow">DAILY LESSONS · SHORT SAMPLE</span>
          <h1>{sample.title}</h1>
          <p>{sample.description} Read or listen to three short sentences below.</p>
        </div>
      </section>
      <section className="section shell page-content">
        <LessonPlayer lesson={sample} />
      </section>
      <SectionFolderCatalog slug="daily-lessons" />
    </>
  );
}

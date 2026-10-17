import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import {
  CategoryManager,
  VideoEditor,
  VideoUpload,
} from "@/components/video-admin";
export const dynamic = "force-dynamic";

export default async function YouTubeAdministration() {
  if (!(await isAdmin()))
    return (
      <section className="section shell">
        <h1>Administration</h1>
        <p>This area is available only to the site administrator.</p>
        <a href="/">Go home</a>
      </section>
    );
  try {
    const [categories, lessons] = await Promise.all([
      getVideoCategories("youtube"),
      getDb()
        .select()
        .from(videoLessons)
        .where(eq(videoLessons.contentKind, "youtube"))
        .orderBy(desc(videoLessons.createdAt))
        .all(),
    ]);
    return (
      <section className="section shell admin-page video-studio">
        <a href="/administration" className="folder-back">
          ← Administration
        </a>
        <span className="section-eyebrow">ADMINISTRATION</span>
        <h1>YouTube Lessons studio</h1>
        <p>
          Add a YouTube URL, create the English transcript once as timestamped
          passages, and then prepare only the translation languages you need.
          Saved English and translations are reused for every student.
        </p>
        <ol className="admin-workflow">
          <li>
            <strong>Add the YouTube URL and create English once:</strong> import
            SRT/VTT, import captions from a connected YouTube account you
            control, or transcribe authorized original media with AssemblyAI.
          </li>
          <li>
            <strong>Review and save English:</strong> correct every passage and
            timestamp first.
          </li>
          <li>
            <strong>Generate each needed language:</strong> select Persian or
            another language and press its Generate button. Existing saved
            translations are reused.
          </li>
          <li>
            <strong>Review, save, and publish:</strong> edit any mistakes, save
            the transcript, then publish the lesson with all prepared languages.
          </li>
        </ol>
        <p>
          <a className="button secondary" href="/administration/media-apis">
            YouTube, transcription & translation API settings
          </a>
        </p>
        <CategoryManager categories={categories} section="youtube" />
        <div className="detail-grid">
          <div className="detail-panel">
            <h2>YouTube drafts and lessons</h2>
            {lessons.length ? (
              lessons.map((lesson) => (
                <article
                  className="admin-lesson"
                  id={`lesson-${lesson.id}`}
                  key={lesson.id}
                >
                  <details>
                    <summary>
                      <strong>{lesson.title}</strong> · {lesson.status}
                    </summary>
                    <a href={`/video-lessons/${lesson.id}`}>Preview lesson</a>
                    <VideoEditor
                      id={lesson.id}
                      initial={lesson.transcript}
                      status={lesson.status}
                      category={lesson.category}
                      categories={categories}
                      contentKind="youtube"
                      title={lesson.title}
                      description={lesson.description}
                      level={lesson.level}
                      displayFormat={lesson.displayFormat}
                      sourceUrl={lesson.sourceUrl}
                      thumbnailKey={lesson.thumbnailKey}
                      thumbnailSource={lesson.thumbnailSource}
                      thumbnailSettings={lesson.thumbnailSettings}
                      hasTranscriptionSource={Boolean(lesson.mediaKey)}
                    />
                  </details>
                </article>
              ))
            ) : (
              <p>No YouTube lessons have been added yet.</p>
            )}
          </div>
          <aside className="detail-panel" id="add-content">
            <h2>Add a YouTube lesson</h2>
            <VideoUpload
              categories={categories}
              initialSection="youtube"
              lockedSection
            />
          </aside>
        </div>
      </section>
    );
  } catch {
    return (
      <section className="section shell">
        <h1>YouTube Lessons studio</h1>
        <p className="notice">
          The lesson database is temporarily unavailable. Please try again
          later.
        </p>
      </section>
    );
  }
}

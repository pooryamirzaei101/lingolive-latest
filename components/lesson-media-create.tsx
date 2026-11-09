"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { translationLanguages } from "@/lib/languages";
import type { VideoCategory } from "@/lib/video";
import { uploadAdminMedia, discardAdminMedia } from "@/lib/admin-upload-client";
type Section =
  | "video"
  | "speaking"
  | "youtube"
  | "podcast"
  | "ielts-listening"
  | "ielts-reading"
  | "ielts-speaking";
export function LessonMediaCreate({
  categories,
  section,
}: {
  categories: VideoCategory[];
  section: Section;
}) {
  const router = useRouter(),
    [source, setSource] = useState(
      section === "youtube" ? "youtube" : "upload",
    ),
    [mode, setMode] = useState("manual"),
    [language, setLanguage] = useState("fa"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [rows, setRows] = useState([
      { start: 0, end: 3, english: "", translation: "" },
    ]);
  const ielts = section.startsWith("ielts-");
  function update(i: number, p: Partial<(typeof rows)[number]>) {
    setRows((values) => values.map((v, n) => (n === i ? { ...v, ...p } : v)));
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget,
      data = new FormData(form);
    setBusy(true);
    setMessage("Saving draft…");
    let key: string | null = null,
      saved = false;
    try {
      data.set("transcriptMode", mode);
      data.set("translationLanguage", language);
      if (
        mode === "manual" &&
        rows.some((r) => r.translation.trim() && !r.english.trim())
      )
        throw Error("Add English text for each translated sentence.");
      data.set(
        "segments",
        JSON.stringify(
          rows
            .filter((r) => r.english.trim())
            .map((r) => ({
              start: r.start,
              end: r.end,
              english: r.english,
              translations: r.translation.trim()
                ? { [language]: r.translation }
                : {},
            })),
        ),
      );
      if (source === "upload") {
        const file = data.get("media");
        if (file instanceof File && file.size) {
          const kind = file.type.startsWith("audio/") ? "audio" : "video";
          key = await uploadAdminMedia(file, kind, setMessage);
          data.set("uploadKey", key);
          data.set("mediaKind", kind);
        }
      }
      const cover = data.get("thumbnail");
      data.delete("media");
      data.delete("thumbnail");
      if (ielts) {
        data.set(
          "kind",
          section === "ielts-speaking"
            ? "speaking_video"
            : section === "ielts-reading"
              ? "reading"
              : "listening",
        );
        data.set("question", String(data.get("title")));
        data.set(
          "videoUrl",
          source === "youtube" ? String(data.get("sourceUrl")) : "",
        );
        data.set(
          "format",
          source === "audio"
            ? "audio"
            : source === "none"
              ? "reading"
              : "video",
        );
      } else data.set("contentKind", section);
      const response = await fetch(
          ielts ? "/api/admin/ielts-speaking" : "/api/admin/video-lessons",
          { method: "POST", body: data },
        ),
        result = (await response.json()) as any;
      if (!response.ok || !result.id)
        throw Error(result.error || "Could not create draft.");
      saved = true;
      key = null;
      if (cover instanceof File && cover.size) {
        const body = new FormData();
        body.set(ielts ? "file" : "image", cover);
        const uploaded = await fetch(
          ielts
            ? `/api/admin/ielts-speaking/${result.id}/asset/thumbnail`
            : `/api/admin/video-lessons/${result.id}/thumbnail`,
          { method: "POST", body },
        );
        if (!uploaded.ok)
          throw Error(
            "Draft saved, but cover upload failed. Retry in the editor.",
          );
      }
      router.refresh();
      if (
        mode === "api" &&
        (source === "upload" || data.get("transcriptionMediaUrl"))
      ) {
        const processing = await fetch(
            `/api/admin/video-lessons/${result.id}/processing${ielts ? "?section=ielts" : ""}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "start",
                mediaUrl: data.get("transcriptionMediaUrl") || undefined,
                languages: [],
              }),
            },
          ),
          job = (await processing.json()) as any;
        if (!processing.ok)
          throw Error(
            `Draft saved. ${job.error || "Retry generation in the editor."}`,
          );
      }
      setMessage(
        mode === "api"
          ? "Draft saved. Review and save its English transcript in the editor, then generate the selected translation. For a YouTube URL, attach matching original media, use a custom API with an accessible media URL, or import SRT."
          : "Draft saved. Review sentences and translations, then publish.",
      );
      router.refresh();
    } catch (e) {
      if (key && !saved) await discardAdminMedia(key);
      setMessage(e instanceof Error ? e.message : "Could not save draft.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <h3>Add {section.replaceAll("-", " ")} lesson</h3>
      <label>
        Title
        <input name="title" required maxLength={ielts ? 240 : 160} />
      </label>
      <label>
        Description
        <textarea name="description" maxLength={ielts ? 1000 : 4000} rows={3} />
      </label>
      <label>
        Folder
        <select name="category" required>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Level
        <select name="level">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
      <label>
        Media source
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="upload">
            Upload video{section === "podcast" || ielts ? " or audio" : ""}
          </option>
          <option value="youtube">YouTube video / Shorts link</option>
          {section === "ielts-reading" && (
            <option value="none">Reading text only</option>
          )}
        </select>
      </label>
      <label>
        Video size
        <select name="displayFormat">
          <option value="landscape">Standard · 16:9</option>
          <option value="vertical">Vertical / Shorts · 9:16</option>
        </select>
      </label>
      {source === "youtube" ? (
        <label>
          YouTube video URL
          <input
            type="url"
            name="sourceUrl"
            required
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </label>
      ) : source === "upload" ? (
        <label>
          Media file (up to 100 MB)
          <input
            type="file"
            name="media"
            required
            accept={
              section === "podcast" || ielts
                ? "audio/*,video/mp4,video/webm"
                : "video/mp4,video/webm"
            }
          />
        </label>
      ) : null}
      {section === "ielts-reading" && (
        <label>
          Reading passage
          <textarea name="answer" required rows={8} maxLength={50000} />
        </label>
      )}
      <label>
        Thumbnail / cover image (optional)
        <input
          type="file"
          name="thumbnail"
          accept="image/jpeg,image/png,image/webp"
        />
      </label>
      <label>
        Transcript and translation source
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="api">1. Generate with connected APIs</option>
          <option value="srt">
            2. Upload English and translation SRT files
          </option>
          <option value="manual">3. Enter paired sentences manually</option>
        </select>
      </label>
      <label>
        Translation language
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {Object.entries(translationLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>
      {mode === "srt" ? (
        <>
          <label>
            English transcript SRT
            <input name="englishSrt" type="file" accept=".srt" required />
          </label>
          <label>
            Translation SRT (matching English timestamps)
            <input name="translationSrt" type="file" accept=".srt" />
          </label>
        </>
      ) : mode === "manual" ? (
        <>
          <p>
            Each sentence has its own English and translation box. Enter timings
            in seconds.
          </p>
          {rows.map((row, i) => (
            <fieldset key={i}>
              <legend>Sentence {i + 1}</legend>
              <div className="transcript-import-grid">
                <label>
                  Start
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.start}
                    onChange={(e) =>
                      update(i, { start: Number(e.target.value) })
                    }
                  />
                </label>
                <label>
                  End
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.end}
                    onChange={(e) => update(i, { end: Number(e.target.value) })}
                  />
                </label>
                <label>
                  English
                  <textarea
                    rows={3}
                    value={row.english}
                    onChange={(e) => update(i, { english: e.target.value })}
                  />
                </label>
                <label>
                  Translation
                  <textarea
                    rows={3}
                    dir={["fa", "ar", "ur"].includes(language) ? "rtl" : "ltr"}
                    value={row.translation}
                    onChange={(e) => update(i, { translation: e.target.value })}
                  />
                </label>
              </div>
              <button
                type="button"
                className="button secondary"
                onClick={() => setRows((v) => v.filter((_, n) => n !== i))}
              >
                Remove sentence
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            className="button secondary"
            onClick={() =>
              setRows((v) => [
                ...v,
                {
                  start: v.at(-1)?.end || 0,
                  end: (v.at(-1)?.end || 0) + 3,
                  english: "",
                  translation: "",
                },
              ])
            }
          >
            Add sentence
          </button>
        </>
      ) : (
        <>
          <p>
            <a href="/administration/media-apis">
              Connect and test your transcription and translation APIs
            </a>
            . Generate English first, review and save it, then generate the
            selected translation from that English. Provider charges may apply.
            Saved results are shared by learners.
          </p>
          {source === "youtube" && (
            <label>
              Matching accessible original media URL (custom JSON transcription
              APIs)
              <input
                name="transcriptionMediaUrl"
                type="url"
                placeholder="https://your-media-host.example/original.mp4"
              />
              <small>
                YouTube playback URLs are not downloadable media files.
                Alternatively, attach the matching original audio/video in the
                saved lesson editor.
              </small>
            </label>
          )}
        </>
      )}
      <button className="button primary" disabled={busy}>
        {busy ? "Saving…" : "Create draft"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}

"use client";
import { splitEnglishScript } from "@/lib/plain-script";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { parseTranscript, type TranscriptSegment } from "@/lib/video";
import {
  translationLanguages,
  translationDirection,
  type TranslationLanguage,
} from "@/lib/languages";
import { YouTubePlayer, type YouTubeHandle } from "@/components/youtube-player";
import { YouTubeSourceUpload } from "@/components/youtube-source-upload";
import { parseSrt, parseVtt, validateSegments } from "@/lib/transcript-import";
export function TranscriptEditor({
  id,
  initial,
  youtube = false,
  section = "video",
  sourceUrl,
  mediaVersion = 0,
  status = "draft",
  podcastAudio = false,
  podcast = false,
  autoPoll = false,
  ieltsVideo = false,
  hasTranscriptionSource = false,
}: {
  ieltsVideo?: boolean;
  autoPoll?: boolean;
  podcast?: boolean;
  podcastAudio?: boolean;
  status?: string;
  sourceUrl?: string;
  mediaVersion?: number;
  id: string;
  initial: string;
  youtube?: boolean;
  section?: string;
  hasTranscriptionSource?: boolean;
}) {
  const processingUrl = `/api/admin/video-lessons/${id}/processing?section=${section}`,
    saveUrl =
      section === "video"
        ? `/api/admin/video-lessons/${id}`
        : `/api/admin/media-transcripts/${section}/${id}`;
  const video = useRef<HTMLVideoElement>(null),
    yt = useRef<YouTubeHandle | null>(null),
    [reviewTime, setReviewTime] = useState(0),
    [mediaError, setMediaError] = useState(""),
    [retry, setRetry] = useState(0);
  const router = useRouter(),
    [savedRows, setSavedRows] = useState<TranscriptSegment[]>(() =>
      parseTranscript(initial),
    ),
    [rows, setRows] = useState<TranscriptSegment[]>(() =>
      parseTranscript(initial),
    ),
    [lang, setLang] = useState<TranslationLanguage>("fa"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [pollPaused, setPollPaused] = useState(false),
    [text, setText] = useState(""),
    [translation, setTranslation] = useState(""),
    [offset, setOffset] = useState(0),
    [job, setJob] = useState<any>(null),
    [sourceAttached, setSourceAttached] = useState(hasTranscriptionSource);
  useEffect(() => {
    let cancelled = false;
    async function refreshJob() {
      try {
        const r = await fetch(processingUrl, { cache: "no-store" }),
          d = (await r.json()) as any;
        if (!cancelled && r.ok) setJob(d.job);
      } catch {}
    }
    refreshJob();
    if ((podcast || autoPoll) && status === "draft") {
      const timer = setInterval(() => {
        if (!cancelled) refreshJob();
      }, 6000);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [id, processingUrl, podcast, autoPoll, status]);
  async function action(action: string, targets: string[] = []) {
    setBusy(true);
    try {
      let settings = {};
      if (["start", "translate", "poll"].includes(action)) {
        const response = await fetch("/api/admin/media-integrations", {
            cache: "no-store",
          }),
          saved = (await response.json()) as any;
        if (!response.ok)
          throw Error(saved.error || "Could not load saved API settings.");
        settings = {
          translationProvider: saved.translationProvider,
          generationEnabled: saved.enabled,
        };
      }
      const r = await fetch(processingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, languages: targets, ...settings }),
      });
      const d = (await r.json()) as any;
      if (!r.ok)
        throw new Error(
          `${d.error || "Processing failed."}${d.code ? ` [${d.code}: ${d.field}]` : ""}`,
        );
      setPollPaused(false);
      if (action === "apply") {
        setRows(parseTranscript(job.segments));
        setSavedRows(parseTranscript(job.segments));
        setJob({
          ...job,
          state: section === "video" ? "needs_review" : "applied",
        });
        setMessage(
          "Generated transcript added to the draft. Review timings and translations before publishing.",
        );
        router.refresh();
      } else setJob(d.job);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Processing failed");
      setPollPaused(true);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (
      !job ||
      !["transcribing", "translating"].includes(job.state) ||
      busy ||
      pollPaused
    )
      return;
    const timer = setTimeout(() => action("poll"), 4000);
    return () => clearTimeout(timer);
  }, [job, busy, pollPaused]);
  function edit(index: number, value: Partial<TranscriptSegment>) {
    setRows((old) =>
      old.map((r, i) =>
        i === index
          ? {
              ...r,
              ...value,
              ...(value.english !== undefined && value.english !== r.english
                ? { translations: {}, words: undefined }
                : {}),
            }
          : r,
      ),
    );
  }
  async function save() {
    setBusy(true);
    try {
      const segments = validateSegments(rows);
      const r = await fetch(saveUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: JSON.stringify(segments) }),
      });
      const d = (await r.json()) as any;
      if (!r.ok)
        throw new Error(
          `${d.error || "Processing failed."}${d.code ? ` [${d.code}: ${d.field}]` : ""}`,
        );
      setPollPaused(false);
      setRows(segments);
      setSavedRows(segments);
      if (job?.state === "needs_review") setJob({ ...job, state: "approved" });
      setMessage(
        youtube
          ? "English passages, timestamps, and prepared translations are saved. Publish the lesson when ready."
          : "Reviewed transcript saved as a draft. Publish when ready.",
      );
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }
  async function importSrt(file: File | undefined, english: boolean) {
    if (!file) return;
    try {
      if (file.size > 10000000)
        throw new Error("Use an SRT or VTT file up to 10 MB.");
      const imported = file.name.toLowerCase().endsWith(".vtt")
        ? parseVtt(await file.text())
        : parseSrt(await file.text());
      if (english) {
        if (
          rows.length &&
          !confirm(
            "Replace the English transcript and existing translations with this SRT?",
          )
        )
          return;
        setRows(
          imported.map((r) => ({
            start: r.start,
            end: r.end,
            english: r.text,
            translations: {},
          })),
        );
      } else {
        if (
          imported.length !== rows.length ||
          imported.some(
            (r, i) =>
              Math.abs(r.start - rows[i].start) > 0.05 ||
              Math.abs(r.end - rows[i].end) > 0.05,
          )
        )
          throw new Error(
            "The translation SRT must have the same sentence count and timestamps as the English SRT.",
          );
        setRows(
          rows.map((r, i) => ({
            ...r,
            translations: { ...r.translations, [lang]: imported[i].text },
          })),
        );
      }
      setMessage("SRT imported. Review and save the transcript.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Invalid SRT or VTT");
    }
  }
  function importText() {
    const english = podcast
        ? splitEnglishScript(text)
        : text
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean),
      translated = translation
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
    if (
      !english.length ||
      (translated.length && translated.length !== english.length)
    ) {
      setMessage(
        "Use one English sentence per line and the same number of translation lines.",
      );
      return;
    }
    if (
      rows.length &&
      !confirm("Replace this transcript with the entered text?")
    )
      return;
    setRows(
      english.map((s, i) => ({
        start: i * 3,
        end: (i + 1) * 3,
        english: s,
        translations: translated[i] ? { [lang]: translated[i] } : {},
      })),
    );
    setMessage(
      "Text imported with temporary 3-second timings. Adjust each time to match the media before publishing.",
    );
  }
  function shiftTimes() {
    if (!Number.isFinite(offset) || Math.abs(offset) > 3600) {
      setMessage("Use a timing shift between -3,600 and +3,600 seconds.");
      return;
    }
    try {
      const shifted = validateSegments(
        rows.map((row) => ({
          ...row,
          start: Math.round((row.start + offset) * 1000) / 1000,
          end: Math.round((row.end + offset) * 1000) / 1000,
        })),
      );
      setRows(shifted);
      setOffset(0);
      setMessage(
        "Times shifted. Play the first and last sentences to check synchronization, then save the transcript.",
      );
    } catch {
      setMessage(
        "A negative shift puts a subtitle before the video starts. Use a smaller shift.",
      );
    }
  }
  function seekReview(start: number) {
    if (youtube) {
      yt.current?.seekTo(start, true);
      yt.current?.playVideo();
    } else if (video.current) {
      video.current.currentTime = start;
      video.current
        .play()
        .catch(() =>
          setMediaError("Press Play on the media player to begin review."),
        );
    }
    setReviewTime(start);
  }
  function generateEnglish() {
    if (youtube && !sourceAttached) {
      if (
        confirm(
          "Import the timed English captions from this YouTube video? The connected YouTube account must be allowed to edit the video.",
        )
      )
        action("captions", []);
      return;
    }
    if (
      confirm(
        "Send the attached original media to AssemblyAI for an English transcript with timestamps? Provider charges may apply.",
      )
    )
      action("start", []);
  }
  return (
    <section className="transcript-admin">
      <h3>
        {youtube ? "YouTube transcript workflow" : "Subtitles & translations"}
      </h3>
      <p>
        {youtube
          ? "Create English once as timestamped passages. Every saved translation reuses these exact timestamps."
          : "English and all translations share the same sentence timestamps. Play a sentence to check its timing."}
      </p>
      {youtube && (
        <div
          className="translation-readiness"
          aria-label="YouTube transcript preparation status"
        >
          <div className="translation-readiness-row">
            <strong>1. Saved English</strong>
            <span>
              {savedRows.length
                ? `✓ ${savedRows.length} timestamped passages saved`
                : "Not created yet"}
            </span>
          </div>
          <div className="translation-readiness-row">
            <strong>2. Prepare languages</strong>
            <span>Generate only the languages you need, one time each</span>
          </div>
          <div className="translation-readiness-row">
            <strong>3. Publish</strong>
            <span>Students receive English plus every saved translation</span>
          </div>
        </div>
      )}
      {youtube && sourceUrl ? (
        <YouTubePlayer
          url={sourceUrl}
          title="YouTube lesson review"
          playerRef={yt}
          onTime={setReviewTime}
        />
      ) : (section === "video" && !podcastAudio) || ieltsVideo ? (
        <video
          ref={video}
          key={`${mediaVersion}-${retry}`}
          controls
          playsInline
          preload="metadata"
          src={
            ieltsVideo
              ? `/api/ielts-speaking/${id}/video`
              : `/api/video-lessons/${id}/media?v=${mediaVersion}&retry=${retry}`
          }
          onTimeUpdate={() => setReviewTime(video.current?.currentTime || 0)}
          onLoadedMetadata={() => setMediaError("")}
          onError={() => {
            fetch(
              ieltsVideo
                ? `/api/ielts-speaking/${id}/video`
                : `/api/video-lessons/${id}/media`,
              { method: "HEAD", cache: "no-store" },
            )
              .then((r) =>
                setMediaError(
                  r.ok
                    ? "The file loaded, but your browser could not decode it. Use MP4 with H.264 video and AAC audio, or a supported WebM file."
                    : `Review media could not load (${r.status}). Check or replace the uploaded file.`,
                ),
              )
              .catch(() =>
                setMediaError(
                  "Review media could not connect. Retry playback.",
                ),
              );
          }}
          style={{ width: "100%", maxHeight: 360, marginBottom: 12 }}
          aria-label="Transcript review video"
        />
      ) : (
        <audio
          ref={video as any}
          controls
          preload="metadata"
          onTimeUpdate={() => setReviewTime(video.current?.currentTime || 0)}
          src={
            podcastAudio
              ? `/api/video-lessons/${id}/media`
              : section === "ielts"
                ? `/api/ielts-speaking/${id}/audio`
                : section === "routine"
                  ? `/api/routines/${id}/audio`
                  : `/api/quick-tips/${id}/audio`
          }
          aria-label="Transcript review audio"
        />
      )}
      {mediaError && (
        <p role="status">
          {mediaError}{" "}
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setMediaError("");
              setRetry((n) => n + 1);
            }}
          >
            Retry playback
          </button>
        </p>
      )}
      {youtube && (
        <details open>
          <summary>Create timestamped English passages</summary>
          <p>
            Import existing English captions through the official YouTube API
            for a video your connected account can edit. Or transcribe an
            authorized original file. YouTube playback remains embedded.
          </p>
          <a href="/administration/media-apis">Connect YouTube account</a>
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={() => {
              if (
                confirm("Import English captions using your YouTube API quota?")
              )
                action("captions", []);
            }}
          >
            Import English captions from YouTube
          </button>
          <YouTubeSourceUpload
            id={id}
            onSaved={() => {
              setJob(null);
              setSourceAttached(true);
            }}
          />
        </details>
      )}
      <label>
        Language to prepare
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as TranslationLanguage)}
        >
          {Object.entries(translationLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <div className="transcript-import-grid">
        <label>
          Import English SRT or VTT
          <input
            type="file"
            accept=".srt,.vtt,text/plain,text/vtt"
            onChange={(e) => {
              importSrt(e.target.files?.[0], true);
              e.target.value = "";
            }}
          />
        </label>
        <label>
          Import {translationLanguages[lang]} SRT or VTT
          <input
            type="file"
            accept=".srt,.vtt,text/plain,text/vtt"
            onChange={(e) => {
              importSrt(e.target.files?.[0], false);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <details>
        <summary>Add plain text</summary>
        <div className="transcript-import-grid">
          <label>
            English — one sentence per line
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <label>
            {translationLanguages[lang]} — one sentence per line
            <textarea
              rows={8}
              value={translation}
              dir={translationDirection(lang)}
              onChange={(e) => setTranslation(e.target.value)}
            />
          </label>
        </div>
        <p>
          Plain text has no timestamps. Temporary times must be corrected using
          the media.
        </p>
        <button className="button secondary" type="button" onClick={importText}>
          Import text
        </button>
        {section === "ielts" && (
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={() => action("start", [])}
          >
            Generate timestamps from the audio
          </button>
        )}
        <p>
          AssemblyAI transcribes the attached media. Compare its timed words
          with your pasted script before applying; if the wording differs,
          correct it and edit timings manually.
        </p>
      </details>
      {
        <details
          className="api-generation"
          open={podcast || youtube ? true : undefined}
        >
          <summary>
            {podcast
              ? "Synchronize English transcript with podcast audio"
              : "Generate with APIs"}
          </summary>
          <p>
            <a href="/administration/media-apis">
              Connect transcription and translation APIs
            </a>
            . Generation uses your provider quota. Existing edits remain
            unchanged until you apply the result.
          </p>
          <p>
            Review and save the English sentences and timestamps first. Then
            generate each language from that saved English transcript, review
            its translations, and save again before publishing.
          </p>
          <div className="translation-readiness">
            {Object.entries(translationLanguages).map(([code, name]) => {
              const count = savedRows.filter((r) =>
                r.translations[code]?.trim(),
              ).length;
              return (
                <div className="translation-readiness-row" key={code}>
                  <span>{name}</span>
                  <span>
                    {job?.state === "review" &&
                    JSON.parse(job.languages || "[]").includes(code)
                      ? "Generated · review needed"
                      : savedRows.length && count === savedRows.length
                        ? status === "published"
                          ? "✓ Published"
                          : "✓ Saved and reviewed"
                        : `${count} / ${savedRows.length} saved sentences`}
                  </span>
                  <button
                    type="button"
                    className="button secondary"
                    disabled={
                      busy ||
                      !savedRows.length ||
                      JSON.stringify(rows) !== JSON.stringify(savedRows) ||
                      ["uploading", "transcribing", "translating"].includes(
                        job?.state,
                      )
                    }
                    onClick={() => {
                      if (
                        confirm(
                          `Generate the missing ${name} passages from the saved English transcript and timestamps?`,
                        )
                      )
                        action("translate", [code]);
                    }}
                  >
                    Generate {name}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="button secondary"
            disabled={
              busy ||
              job?.state === "translating" ||
              (["uploading", "transcribing"].includes(job?.state) &&
                Date.now() - job.createdAt < 20 * 60_000)
            }
            onClick={generateEnglish}
          >
            {podcast
              ? "Synchronize English text with audio"
              : youtube && !sourceAttached
                ? "Generate English from YouTube captions"
                : youtube
                  ? "Generate English with AssemblyAI"
                  : "Generate English transcript"}
          </button>
          {youtube && !sourceAttached && (
            <p className="translation-pending">
              A YouTube URL alone is used for playback. Automatic caption import
              works for a video your connected YouTube account can edit. For
              other authorized videos, import SRT/VTT or attach the matching
              original media above for AssemblyAI.
            </p>
          )}
          {job?.state === "needs_review" && (
            <p role="status">
              Review the generated English text, timestamps, and translations
              below, then press Save transcript before publishing.
            </p>
          )}
          {job && (
            <p role="status">
              Processing: {job.state}
              {job.error ? ` · ${job.error}` : ""}. You can return to this
              editor to resume processing.
            </p>
          )}
          {pollPaused && (
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => action("poll")}
            >
              Retry processing after fixing settings
            </button>
          )}
          {job?.state === "review" && (
            <button
              type="button"
              className="button primary"
              disabled={busy}
              onClick={() => {
                if (
                  confirm(
                    "Replace the draft transcript with the generated result?",
                  )
                )
                  action("apply");
              }}
            >
              Apply generated draft for review
            </button>
          )}
        </details>
      }
      {youtube && rows.length > 0 && (
        <div className="subtitle-timing-tool">
          <h4>Synchronize SRT with this YouTube video</h4>
          <p>
            Play the first spoken sentence above. If its subtitle appears early
            or late, shift every timestamp. A positive number makes subtitles
            appear later; a negative number makes them appear earlier. Check the
            last sentence too. If the difference changes during the video, use
            an SRT made for this exact upload.
          </p>
          <label>
            Shift all subtitles (seconds)
            <input
              type="number"
              min="-3600"
              max="3600"
              step="0.1"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className="button secondary"
            disabled={busy || !offset}
            onClick={shiftTimes}
          >
            Apply timing shift
          </button>
        </div>
      )}
      <div className="subtitle-edit-list">
        {rows.map((row, index) => (
          <article
            className={`subtitle-edit-row ${reviewTime >= row.start && reviewTime < row.end ? "selected" : ""}`}
            key={index}
          >
            <div className="subtitle-times">
              <strong>Sentence {index + 1}</strong>
              <button
                type="button"
                className="button secondary"
                onClick={() => seekReview(row.start)}
              >
                Play sentence
              </button>
              <label>
                Start (seconds)
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={row.start}
                  onChange={(e) =>
                    edit(index, { start: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                End (seconds)
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={row.end}
                  onChange={(e) => edit(index, { end: Number(e.target.value) })}
                />
              </label>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  const midpoint = (row.start + row.end) / 2,
                    at = Math.ceil(row.english.length / 2),
                    breakAt = row.english.indexOf(" ", at);
                  if (breakAt < 0) {
                    setMessage(
                      "Add a space near the sentence midpoint before splitting.",
                    );
                    return;
                  }
                  setRows([
                    ...rows.slice(0, index),
                    {
                      ...row,
                      end: midpoint,
                      english: row.english.slice(0, breakAt),
                      words: undefined,
                      translations: {},
                    },
                    {
                      ...row,
                      start: midpoint,
                      english: row.english.slice(breakAt + 1),
                      words: undefined,
                      translations: {},
                    },
                    ...rows.slice(index + 1),
                  ]);
                  setMessage(
                    "Sentence split at the midpoint. Check both timestamps.",
                  );
                }}
              >
                Split
              </button>
              {index < rows.length - 1 && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    const next = rows[index + 1];
                    setRows([
                      ...rows.slice(0, index),
                      {
                        ...row,
                        end: next.end,
                        english: `${row.english} ${next.english}`,
                        words: undefined,
                        translations: {},
                      },
                      ...rows.slice(index + 2),
                    ]);
                    setMessage("Sentences merged. Review the text and timing.");
                  }}
                >
                  Merge next
                </button>
              )}
              <button
                className="button danger"
                type="button"
                onClick={() => setRows(rows.filter((_, i) => i !== index))}
              >
                Remove sentence
              </button>
            </div>
            <div className="transcript-import-grid">
              <label>
                English
                <textarea
                  rows={4}
                  value={row.english}
                  onChange={(e) => edit(index, { english: e.target.value })}
                />
              </label>
              <label>
                {translationLanguages[lang]}
                <textarea
                  rows={4}
                  dir={translationDirection(lang)}
                  value={row.translations[lang] || ""}
                  onChange={(e) =>
                    edit(index, {
                      translations: {
                        ...row.translations,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>
            {row.words?.length ? (
              <details className="word-timing-editor">
                <summary>Review {row.words.length} word timestamps</summary>
                {row.words.map((word, wordIndex) => (
                  <div className="word-timing-row" key={wordIndex}>
                    <label>
                      Word
                      <input
                        value={word.text}
                        onChange={(e) =>
                          edit(index, {
                            words: row.words!.map((w, j) =>
                              j === wordIndex
                                ? { ...w, text: e.target.value }
                                : w,
                            ),
                          })
                        }
                      />
                    </label>
                    <label>
                      Start
                      <input
                        type="number"
                        min={row.start}
                        max={row.end}
                        step="0.001"
                        value={word.start}
                        onChange={(e) =>
                          edit(index, {
                            words: row.words!.map((w, j) =>
                              j === wordIndex
                                ? { ...w, start: Number(e.target.value) }
                                : w,
                            ),
                          })
                        }
                      />
                    </label>
                    <label>
                      End
                      <input
                        type="number"
                        min={row.start}
                        max={row.end}
                        step="0.001"
                        value={word.end}
                        onChange={(e) =>
                          edit(index, {
                            words: row.words!.map((w, j) =>
                              j === wordIndex
                                ? { ...w, end: Number(e.target.value) }
                                : w,
                            ),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => seekReview(word.start)}
                    >
                      Play word
                    </button>
                  </div>
                ))}
              </details>
            ) : null}
          </article>
        ))}
      </div>
      <div className="admin-actions">
        <button
          type="button"
          className="button secondary"
          onClick={() =>
            setRows([
              ...rows,
              {
                start: rows.at(-1)?.end || 0,
                end: (rows.at(-1)?.end || 0) + 3,
                english: "",
                translations: {},
              },
            ])
          }
        >
          Add sentence
        </button>
        <button
          className="button primary"
          type="button"
          disabled={busy}
          onClick={save}
        >
          Save transcript
        </button>
      </div>
      <p role="status">{message}</p>
    </section>
  );
}

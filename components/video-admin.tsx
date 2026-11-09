"use client";
import {LessonMediaCreate} from "@/components/lesson-media-create";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_CATEGORIES,
  parseTranscript,
  type ContentSection,
  type VideoCategory,
} from "@/lib/video";
import {
  discardAdminMedia,
  prepareAdminMedia,
  uploadAdminMedia,
} from "@/lib/admin-upload-client";

import { generateThumbnailForLesson } from "@/lib/generate-thumbnail-client";
import { ThumbnailEditor } from "@/components/thumbnail-editor";
import { TranscriptEditor } from "@/components/transcript-editor";
import {
  translationLanguages,
  type TranslationLanguage,
} from "@/lib/languages";
const categoryLabel = (category: VideoCategory, categories: VideoCategory[]) =>
  `${category.parentId ? `${categories.find((c) => c.id === category.parentId)?.name || "Folder"} / ` : ""}${category.name}`;
export function VideoUpload({categories,initialSection="video"}:{categories:VideoCategory[];initialSection?:"video"|"speaking"|"youtube";lockedSection?:boolean}){return <LessonMediaCreate categories={categories} section={initialSection}/>}
export function VideoEditor({
  id,
  initial,
  status,
  category,
  categories,
  contentKind,
  title,
  description,
  level,
  displayFormat,
  sourceUrl,
  thumbnailKey,
  thumbnailSource,
  thumbnailSettings,
  hasTranscriptionSource = false,
}: {
  id: string;
  initial: string;
  status: string;
  category: string;
  categories: VideoCategory[];
  contentKind: string;
  title: string;
  description: string;
  level: string;
  displayFormat: string;
  sourceUrl: string | null;
  thumbnailKey: string | null;
  thumbnailSource: string;
  thumbnailSettings: string;
  hasTranscriptionSource?: boolean;
}) {
  const router = useRouter(),
    [mediaVersion, setMediaVersion] = useState(0),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const hasSavedEnglish = parseTranscript(initial).length > 0;
  async function change(body: object, method = "PATCH") {
    setBusy(true);
    setMessage("Saving…");
    try {
      const response = await fetch(`/api/admin/video-lessons/${id}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save");
      setMessage(method === "DELETE" ? "Deleted." : "Saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }
  async function replaceVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("Preparing replacement…");
    let key: string | null = null;
    try {
      const prepared = await prepareAdminMedia(
        event.currentTarget,
        "video",
        setMessage,
      );
      key = prepared.key;
      prepared.body.delete("thumbnail");
      const response = await fetch(`/api/admin/video-lessons/${id}/media`, {
          method: "POST",
          body: prepared.body,
        }),
        data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not upload");
      setMediaVersion(Date.now());
      setMessage(
        "Video replaced. Review the transcript before publishing again.",
      );
      router.refresh();
    } catch (error) {
      if (key) await discardAdminMedia(key);
      setMessage(error instanceof Error ? error.message : "Could not upload");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-editor">
      <div className="admin-actions">
        <button
          type="button"
          className="button secondary"
          disabled={
            busy ||
            (!!sourceUrl &&
              status !== "published" &&
              !hasSavedEnglish)
          }
          onClick={() =>
            change({ status: status === "published" ? "draft" : "published" })
          }
        >
          {status === "published"
            ? "Unpublish"
            : !!sourceUrl
              ? "Publish lesson and saved translations"
              : "Publish"}
        </button>
        <button
          type="button"
          className="button danger"
          disabled={busy}
          onClick={() => {
            if (
              confirm(
                `Permanently delete “${title}” and its uploaded video, transcript, and cover image? This cannot be undone.`,
              )
            )
              change({}, "DELETE");
          }}
        >
          Delete video
        </button>
      </div>
      {!!sourceUrl &&
        !hasSavedEnglish &&
        status !== "published" && (
          <p className="translation-pending">
            Create, review, and save the timestamped English transcript before
            publishing this YouTube lesson.
          </p>
        )}
      <p role="status">{message}</p>
      <form
        className="admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          change(Object.fromEntries(form.entries()));
        }}
      >
        <label>
          Lesson title
          <input name="title" defaultValue={title} maxLength={160} required />
        </label>
        <label>
          Description
          <textarea
            name="description"
            defaultValue={description}
            rows={6}
            maxLength={4000}
          />
        </label>
        <div className="admin-form-row">
          <label>
            Level
            <select name="level" defaultValue={level}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          {!sourceUrl && (
            <label>
              Video format
              <select name="displayFormat" defaultValue={displayFormat}>
                <option value="landscape">Standard (landscape)</option>
                <option value="vertical">Vertical (reel style)</option>
                <option value="square">Square (1:1)</option>
              </select>
            </label>
          )}
        </div>
        {!!sourceUrl && (
          <label>
            YouTube URL
            <input
              name="sourceUrl"
              defaultValue={sourceUrl?.replace("/embed/", "/watch?v=")}
              required
            />
          </label>
        )}
        <button className="button secondary" disabled={busy}>
          Save details
        </button>
      </form>
      <label className="admin-category-select">
        Move to folder
        <select
          value={category}
          onChange={(event) => {
            const selected = categories.find(
              (item) => item.id === event.target.value,
            );
            if (selected)
              change({ category: selected.id, contentKind: selected.section });
          }}
          disabled={busy}
        >
          {!categories.some((item) => item.id === category) && (
            <option value={category}>{category} (old folder)</option>
          )}
          {categories
            .filter(
              (item) =>
                ["video", "speaking", "youtube"].includes(item.section) &&
                item.section === contentKind,
            )
            .map((item) => (
              <option value={item.id} key={item.id}>
                {sectionNames[item.section]} / {categoryLabel(item, categories)}
              </option>
            ))}
        </select>
      </label>
      <ThumbnailEditor
        id={id}
        format={displayFormat}
        thumbnailKey={thumbnailKey}
        thumbnailSource={thumbnailSource}
        settings={thumbnailSettings}
        videoAvailable={!sourceUrl}
      />
      {
        <TranscriptEditor
          id={id}
          key={`${id}-${mediaVersion}`}
          initial={mediaVersion?"[]":initial}
          status={status}
          youtube={!!sourceUrl}
          sourceUrl={sourceUrl || undefined}
          mediaVersion={mediaVersion}
          hasTranscriptionSource={hasTranscriptionSource}
        />
      }
      {!sourceUrl && (
        <form className="admin-form" onSubmit={replaceVideo}>
          <label>
            Replace video (MP4 or WebM, up to 100 MB)
            <input
              name="video"
              type="file"
              accept="video/mp4,video/webm"
              required
            />
          </label>
          <button className="button secondary" disabled={busy}>
            Replace video
          </button>
        </form>
      )}
      <p role="status">{message}</p>
    </div>
  );
}

const sectionNames: Record<ContentSection, string> = {
  podcast: "Podcasts",
  video: "Video Lessons",
  speaking: "Speaking Practice",
  reading: "Reading Room",
  daily: "Daily Lessons",
  youtube: "YouTube Videos",
  ielts: "IELTS Examples",
  tips: "Quick Tips",
};
const categoryHref = (section: ContentSection, id: string) =>
  section === "podcast"
    ? `/podcasts`
    : section === "reading"
      ? `/reading-room/categories/${id}`
      : section === "speaking"
        ? `/speaking-practice/categories/${id}`
        : section === "video"
          ? id === "news"
            ? "/news"
            : `/video-lessons/categories/${id}`
          : `/${{ podcast: "podcasts", daily: "daily-lessons", youtube: "youtube-videos", ielts: "ielts-examples", tips: "quick-tips" }[section]}/categories/${id}`;
export function CategoryManager({
  categories,
  section,
  rootId,
}: {
  categories: VideoCategory[];
  section: ContentSection;
  rootId?: string;
}) {
  const router = useRouter(),
    [newName, setNewName] = useState(""),
    [parentId, setParentId] = useState(rootId || ""),
    [editing, setEditing] = useState<string | null>(null),
    [name, setName] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function save(
    method: "POST" | "PATCH" | "DELETE",
    body: { name?: string; id?: string; parentId?: string | null },
  ) {
    setBusy(true);
    setMessage("Saving…");
    try {
      const response = await fetch("/api/admin/video-categories", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, section }),
        }),
        data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save");
      setNewName("");
      setEditing(null);
      setMessage(method === "DELETE" ? "Folder deleted." : "Folder saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }
  const all = categories.filter((c) => c.section === section);
  const belongsToRoot = (category: VideoCategory) => {
    let parent = category.parentId;
    for (let i = 0; i < all.length && parent; i++) {
      if (parent === rootId) return true;
      parent = all.find((item) => item.id === parent)?.parentId || null;
    }
    return false;
  };
  const underNews = (category: VideoCategory) => {
    let parent = category.parentId;
    for (let i = 0; i < all.length && parent; i++) {
      if (parent === "news") return true;
      parent = all.find((item) => item.id === parent)?.parentId || null;
    }
    return false;
  };
  const list = rootId
    ? all.filter(belongsToRoot)
    : section === "video"
      ? all.filter((c) => c.id !== "news" && !underNews(c))
      : all;
  return (
    <div className="category-manager">
      <div className="section-head">
        <div>
          <h2>{rootId ? "News" : sectionNames[section]} folders</h2>
          <p>
            Open a folder to see its lessons. Add a main folder or subcategory;
            renaming keeps its content in place.
          </p>
        </div>
      </div>
      <div className="category-admin-grid">
        {list.map((c) => (
          <div className="category-admin-row" key={c.id}>
            {editing === c.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save("PATCH", { id: c.id, name });
                }}
              >
                <input
                  aria-label={`Rename ${c.name}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  required
                />
                <button disabled={busy}>Save</button>
                <button type="button" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{categoryLabel(c, all)}</strong>
                <a
                  className="category-open-link"
                  href={`/administration/folders/${section}/${c.id}`}
                >
                  Open folder
                </a>
                <a
                  className="category-open-link"
                  href={
                    rootId
                      ? `/news/categories/${c.id}`
                      : categoryHref(section, c.id)
                  }
                >
                  Student view
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c.id);
                    setName(c.name);
                  }}
                >
                  Rename
                </button>
                {!DEFAULT_CATEGORIES[section].some(
                  (item) => item.id === c.id,
                ) && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (confirm(`Delete the empty folder "${c.name}"?`))
                        save("DELETE", { id: c.id });
                    }}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <form
        className="category-add"
        onSubmit={(e) => {
          e.preventDefault();
          save("POST", { name: newName, parentId: parentId || null });
        }}
      >
        <label>
          New folder
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={60}
            placeholder={
              rootId
                ? "For example: World News"
                : section === "video"
                  ? "For example: Grammar Practice"
                  : section === "podcast"
                    ? `/podcasts`
                    : section === "reading"
                      ? "For example: Travel Stories"
                      : "For example: Job interviews"
            }
            required
          />
        </label>
        <label>
          Inside folder
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            {rootId ? (
              <option value={rootId}>News</option>
            ) : (
              <option value="">Main folder</option>
            )}
            {list.map((c) => (
              <option value={c.id} key={c.id}>
                {categoryLabel(c, all)}
              </option>
            ))}
          </select>
        </label>
        <button className="button secondary" disabled={busy}>
          Add folder
        </button>
      </form>
      <p role="status">{message}</p>
    </div>
  );
}

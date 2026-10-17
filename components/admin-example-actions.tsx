"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminExampleAction({ id, title, kind, hidden = false }: { id: string; title: string; kind: "video" | "speaking" | "youtube" | "ielts" | "reading" | "daily" | "tips" | "sample"; hidden?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function change() {
    if (!hidden && !confirm(kind === "sample" ? `Remove the example "${title}" from student pages? You can restore it here later.` : `Delete "${title}" and its uploaded media permanently?`)) return;
    setBusy(true);
    setMessage("");
    const url = kind === "sample" ? "/api/admin/sample-visibility" : kind === "daily" ? "/api/admin/routines" : kind === "ielts" ? `/api/admin/ielts-speaking/${id}` : kind === "reading" ? `/api/admin/reading-items/${id}` : kind === "tips" ? `/api/admin/quick-tips/${id}` : `/api/admin/video-lessons/${id}`;
    try {
      const response = await fetch(url, {
        method: hidden ? "DELETE" : kind === "sample" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kind === "sample" || kind === "daily" ? { id } : {}),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Could not update this example.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update this example."); }
    finally { setBusy(false); }
  }
  return <span className="admin-delete-action"><button type="button" className={hidden ? "button secondary" : "button danger"} disabled={busy} onClick={change}>{busy ? "Saving…" : hidden ? "Restore" : "Delete"}</button>{message && <span role="alert">{message}</span>}</span>;
}

export function SampleManager({ samples, hidden }: { samples: { id: string; title: string; category: string }[]; hidden: string[] }) {
  if (!samples.length) return null;
  const removed = new Set(hidden);
  return <div className="detail-panel sample-manager"><h2>Built-in examples</h2><p>Remove a sample from student pages, or restore it later. Uploaded lessons are managed above.</p><div className="admin-folder-list">{samples.map(item => <div className="admin-folder-entry" key={item.id}><div><strong>{item.title}</strong><span>{removed.has(item.id) ? "Removed" : item.category || "Sample lesson"}</span></div><AdminExampleAction kind="sample" id={item.id} title={item.title} hidden={removed.has(item.id)}/></div>)}</div></div>;
}

"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export function ShareLessonButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setMessage("Link copied."); }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Could not share this lesson.");
    }
  }
  return <span className="share-lesson"><button type="button" className="button secondary" onClick={share}><Share2 size={17}/> Share</button>{message && <small role="status">{message}</small>}</span>;
}

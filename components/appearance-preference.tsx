"use client";

import { useEffect, useState } from "react";

type ReadingSize = "standard" | "large" | "extra-large";
const STORAGE_KEY = "ef:reading-size";
const sizes: ReadingSize[] = ["standard", "large", "extra-large"];

function applySize(value: ReadingSize) {
  document.documentElement.dataset.readingSize = value;
}

export function AppearancePreference() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ReadingSize | null;
      applySize(saved && sizes.includes(saved) ? saved : "standard");
    } catch {
      applySize("standard");
    }
    const path = window.location.pathname;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".side-link[href]"));
    const active = links.filter(link => link.getAttribute("href") === path || (link.getAttribute("href") !== "/" && path.startsWith(`${link.getAttribute("href")}/`)))
      .sort((a, b) => (b.getAttribute("href")?.length ?? 0) - (a.getAttribute("href")?.length ?? 0))[0];
    if (active) {
      for (const link of links) if (link.getAttribute("href") === active.getAttribute("href")) link.setAttribute("aria-current", "page");
    }
  }, []);
  return null;
}

export function ReadingSizeControl() {
  const [value, setValue] = useState<ReadingSize>("standard");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ReadingSize | null;
      if (saved && sizes.includes(saved)) setValue(saved);
    } catch {}
  }, []);

  function choose(next: ReadingSize) {
    setValue(next);
    applySize(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }

  return <fieldset className="reading-size-control">
    <legend>Lesson text size</legend>
    <p>Choose a comfortable size for reading passages, transcripts, and subtitles on this device.</p>
    <div className="reading-size-options">
      {sizes.map(size => <label key={size} className={value === size ? "chosen" : ""}>
        <input type="radio" name="reading-size" value={size} checked={value === size} onChange={() => choose(size)}/>
        {size === "extra-large" ? "Extra Large" : size === "large" ? "Large" : "Standard"}
      </label>)}
    </div>
  </fieldset>;
}

import { ieltsSamples } from "@/lib/ielts-speaking";
import { readingExamples } from "@/lib/reading-examples";
import { sampleTips } from "@/lib/quick-tips";
import { morningRoutine } from "@/lib/routines";
import { newsExample, speakingVideoExample, videoExample } from "@/lib/video-example";
import { lessons } from "@/lib/content";

export const sampleCatalog = [
  ...[videoExample, newsExample].map(item => ({ id: item.id, title: item.title, section: "video", category: item.category })),
  { id: speakingVideoExample.id, title: speakingVideoExample.title, section: "speaking", category: speakingVideoExample.category },
  ...ieltsSamples.map(item => ({ id: item.id, title: item.question, section: "ielts", category: item.category })),
  { id: "sample-reading", title: "Read a Library Notice", section: "ielts", category: "ielts-reading" },
  ...readingExamples.map(item => ({ id: item.id, title: item.title, section: "reading", category: item.category })),
  { id: morningRoutine.id, title: morningRoutine.title, section: "daily", category: morningRoutine.category },
  ...sampleTips.map(item => ({ id: item.id, title: item.title, section: "tips", category: item.category })),
  ...lessons.filter(item => !["a-morning-routine", "tip-polite-requests"].includes(item.slug)).map(item => ({
    id: item.slug, title: item.title, section: item.course === "YouTube Videos" ? "youtube" : item.course === "IELTS Examples" ? "ielts" : item.course === "Daily Lessons" ? "daily" : item.course === "Speak with Confidence" || item.course === "Speaking Practice" ? "speaking" : "video", category: "",
  })),
];

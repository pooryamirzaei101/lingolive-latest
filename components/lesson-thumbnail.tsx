import { BookOpen, Headphones, Mic2 } from "lucide-react";

/** Decorative artwork stays crisp at every card size without a remote image request. */
export function LessonThumbnail({ kind }: { kind: "lesson" | "podcast" | "speaking" }) {
  const Icon = kind === "lesson" ? BookOpen : kind === "podcast" ? Headphones : Mic2;
  return <div className={`lesson-thumbnail lesson-thumbnail--${kind}`} aria-hidden="true">
    <span className="thumbnail-sun" />
    <span className="thumbnail-hill thumbnail-hill--back" />
    <span className="thumbnail-hill" />
    <Icon strokeWidth={1.6} />
  </div>;
}

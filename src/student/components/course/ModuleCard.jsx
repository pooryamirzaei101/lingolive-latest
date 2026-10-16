import { useState } from "react";
import LessonItem from "./LessonItem";

export default function ModuleCard({ module }) {
  const [open, setOpen] = useState(true);

  const completedLessons = module.lessons.filter(
    (lesson) => lesson.completed
  ).length;

  return (
    <div className="border rounded-xl overflow-hidden">

      {/* Header */}

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-6 py-5"
      >
        <div className="text-left">

          <h3 className="text-xl font-bold">
            {module.title}
          </h3>

          <p className="text-gray-500 mt-1">
            {completedLessons} / {module.lessons.length} Lessons Completed
          </p>

        </div>

        <div className="text-2xl">

          {open ? "▲" : "▼"}

        </div>

      </button>

      {/* Lessons */}

      {open && (

        <div className="divide-y">

          {module.lessons.map((lesson, index) => (

            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lessonNumber={index + 1}
            />

          ))}

        </div>

      )}

    </div>
  );
}
export default function LessonItem({
  lesson,
  lessonNumber,
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">

      {/* Left Side */}

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
          {lessonNumber}
        </div>

        <div>

          <h4 className="font-semibold text-lg">
            {lesson.title}
          </h4>

          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">

            <span>
              🎥 Video Lesson
            </span>

            <span>
              ⏱ {lesson.duration}
            </span>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-4">

        {lesson.completed && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            ✅ Completed
          </span>
        )}

        {!lesson.completed && !lesson.locked && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            ▶ Start
          </button>
        )}

        {lesson.locked && (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            🔒 Locked
          </span>
        )}

      </div>

    </div>
  );
}
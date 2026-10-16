export default function LessonHeader() {
  const lesson = {
    title: "Present Simple Tense",
    course: "English Grammar Masterclass",
    module: "Module 2 - Grammar Basics",
    duration: "18 Minutes",
    difficulty: "Beginner",
    completed: false,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

        <div>

          <p className="text-blue-600 font-semibold">
            {lesson.course}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {lesson.title}
          </h1>

          <p className="text-gray-500 mt-3">
            {lesson.module}
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <div className="bg-blue-50 px-5 py-3 rounded-lg">

            <p className="text-gray-500 text-sm">
              Duration
            </p>

            <p className="font-bold">
              ⏱ {lesson.duration}
            </p>

          </div>

          <div className="bg-green-50 px-5 py-3 rounded-lg">

            <p className="text-gray-500 text-sm">
              Difficulty
            </p>

            <p className="font-bold">
              📚 {lesson.difficulty}
            </p>

          </div>

          <div className="bg-yellow-50 px-5 py-3 rounded-lg">

            <p className="text-gray-500 text-sm">
              Status
            </p>

            <p className="font-bold">
              {lesson.completed ? "✅ Completed" : "▶ In Progress"}
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-4">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          Mark Complete
        </button>

        <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold">
          Add Bookmark
        </button>

        <button className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
          Download Resources
        </button>

      </div>

    </div>
  );
}
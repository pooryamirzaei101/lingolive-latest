export default function ContinueLearning() {
  const currentCourse = {
    title: "English Grammar Masterclass",
    lesson: "Present Simple Tense",
    progress: 68,
    teacher: "Admin",
    duration: "12h 30m",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Continue Learning
          </h2>

          <p className="text-gray-500">
            Resume where you left off
          </p>

        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Continue
        </button>

      </div>

      <div className="space-y-4">

        <div>

          <p className="text-gray-500 text-sm">
            Current Course
          </p>

          <h3 className="text-xl font-bold">
            {currentCourse.title}
          </h3>

        </div>

        <div>

          <p className="text-gray-500 text-sm">
            Current Lesson
          </p>

          <p className="font-medium">
            {currentCourse.lesson}
          </p>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <p className="text-gray-500 text-sm">
              Teacher
            </p>

            <p>{currentCourse.teacher}</p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Total Duration
            </p>

            <p>{currentCourse.duration}</p>

          </div>

        </div>

        <div>

          <div className="flex justify-between mb-2">

            <span className="font-medium">
              Course Progress
            </span>

            <span>
              {currentCourse.progress}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{
                width: `${currentCourse.progress}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
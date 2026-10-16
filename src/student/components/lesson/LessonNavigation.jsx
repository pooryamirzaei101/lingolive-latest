export default function LessonNavigation() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

        {/* Previous Lesson */}

        <div className="flex-1">

          <button className="w-full border border-gray-300 hover:bg-gray-100 rounded-xl p-5 text-left transition">

            <p className="text-gray-500 text-sm mb-2">
              ← Previous Lesson
            </p>

            <h3 className="text-xl font-bold">
              Module 1 - Introduction
            </h3>

          </button>

        </div>

        {/* Course Progress */}

        <div className="flex-1 text-center">

          <h3 className="text-xl font-bold mb-3">
            Course Progress
          </h3>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600"
              style={{ width: "35%" }}
            />

          </div>

          <p className="mt-3 text-gray-600">
            Lesson 7 of 20 completed
          </p>

        </div>

        {/* Next Lesson */}

        <div className="flex-1">

          <button className="w-full border border-blue-600 hover:bg-blue-50 rounded-xl p-5 text-right transition">

            <p className="text-blue-600 text-sm mb-2">
              Next Lesson →
            </p>

            <h3 className="text-xl font-bold">
              Present Continuous
            </h3>

          </button>

        </div>

      </div>

      {/* Back to Course */}

      <div className="mt-10 text-center">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">

          ← Back to Course

        </button>

      </div>

    </div>
  );
}
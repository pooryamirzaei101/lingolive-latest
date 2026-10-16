export default function CourseDescription() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-6">
        About This Course
      </h2>

      <p className="text-gray-700 leading-8">
        This course is designed to help students improve every aspect of
        English Grammar through practical lessons, real-life examples,
        quizzes, downloadable PDFs, audio practice, vocabulary building,
        and interactive exercises.
      </p>

      <p className="text-gray-700 leading-8 mt-5">
        Whether you are preparing for IELTS, improving your conversation,
        or strengthening your grammar skills, this course provides a
        structured learning path from beginner to advanced levels.
      </p>

      <div className="mt-10">

        <h3 className="text-2xl font-bold mb-5">
          What You'll Learn
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Master English Grammar</span>
          </div>

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Expand Vocabulary</span>
          </div>

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Improve Speaking Skills</span>
          </div>

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Practice Listening</span>
          </div>

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Prepare for IELTS</span>
          </div>

          <div className="flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Build Daily English Confidence</span>
          </div>

        </div>

      </div>

      <div className="mt-10">

        <h3 className="text-2xl font-bold mb-5">
          Course Includes
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🎥</div>
            <p>Video Lessons</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">📄</div>
            <p>PDF Notes</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🎧</div>
            <p>Audio Lessons</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">📝</div>
            <p>Exercises</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🌍</div>
            <p>Translation</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">📚</div>
            <p>Grammar</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">📖</div>
            <p>Vocabulary</p>
          </div>

          <div className="border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p>Certificate</p>
          </div>

        </div>

      </div>

    </div>
  );
}
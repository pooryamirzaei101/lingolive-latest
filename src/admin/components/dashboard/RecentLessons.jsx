export default function RecentLessons() {
  const lessons = [
    {
      id: 1,
      title: "Present Simple Tense",
      course: "English Grammar",
      duration: "18 min",
      completed: true,
    },
    {
      id: 2,
      title: "IELTS Reading Strategies",
      course: "IELTS Preparation",
      duration: "25 min",
      completed: false,
    },
    {
      id: 3,
      title: "Daily Conversation Practice",
      course: "Speaking English",
      duration: "15 min",
      completed: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Lessons
        </h2>

        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-4">

        {lessons.map((lesson) => (

          <div
            key={lesson.id}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-bold text-lg">
                  {lesson.title}
                </h3>

                <p className="text-gray-500">
                  {lesson.course}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-gray-500">
                  {lesson.duration}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    lesson.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {lesson.completed ? "Completed" : "In Progress"}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
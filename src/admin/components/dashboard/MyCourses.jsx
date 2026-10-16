export default function MyCourses() {
  const courses = [
    {
      id: 1,
      title: "English Grammar Masterclass",
      progress: 68,
      lessons: 42,
      image: "📘",
    },
    {
      id: 2,
      title: "IELTS Preparation",
      progress: 35,
      lessons: 58,
      image: "🎯",
    },
    {
      id: 3,
      title: "Daily Conversation",
      progress: 90,
      lessons: 30,
      image: "💬",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          My Courses
        </h2>

        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {courses.map((course) => (

          <div
            key={course.id}
            className="border rounded-xl p-5 hover:shadow-md transition"
          >

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-4">

                <div className="text-5xl">
                  {course.image}
                </div>

                <div>

                  <h3 className="text-lg font-bold">
                    {course.title}
                  </h3>

                  <p className="text-gray-500">
                    {course.lessons} Lessons
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold">
                  {course.progress}%
                </p>

                <p className="text-sm text-gray-500">
                  Completed
                </p>

              </div>

            </div>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{
                  width: `${course.progress}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
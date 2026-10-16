import starterLessons from "../data/lessons";

export default function LessonTable({ lessons = starterLessons, onDelete, onToggleStatus }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Lesson Management
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Level</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{lesson.title}</td>
              <td className="p-3">{lesson.category}</td>
              <td className="p-3">{lesson.level}</td>
              <td className="p-3">{lesson.status}</td>
              <td className="p-3 flex gap-2">
                <button type="button" onClick={() => onToggleStatus?.(lesson.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  {lesson.status === "Published" ? "Unpublish" : "Publish"}
                </button>

                <button type="button" onClick={() => onDelete?.(lesson.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

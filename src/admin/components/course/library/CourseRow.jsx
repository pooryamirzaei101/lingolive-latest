export default function CourseRow({ course }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* Course */}

      <td className="p-4">

        <div className="flex items-center gap-4">

          <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
            📘
          </div>

          <div>

            <h3 className="font-semibold">
              {course.title}
            </h3>

            <p className="text-sm text-gray-500">
              ID: {course.id}
            </p>

          </div>

        </div>

      </td>

      {/* Category */}

      <td className="p-4">
        {course.category}
      </td>

      {/* Teacher */}

      <td className="p-4">
        {course.teacher}
      </td>

      {/* Lessons */}

      <td className="p-4">
        {course.lessons}
      </td>

      {/* Price */}

      <td className="p-4">
        ${course.price}
      </td>

      {/* Status */}

      <td className="p-4">

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {course.status}
        </span>

      </td>

      {/* Actions */}

      <td className="p-4">

        <div className="flex justify-center gap-2">

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            Edit
          </button>

          <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg">
            Duplicate
          </button>

          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
}
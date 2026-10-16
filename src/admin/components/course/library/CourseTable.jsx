import CourseRow from "./CourseRow";

export default function CourseTable({ courses }) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-100 border-b">

            <th className="text-left p-4">Course</th>

            <th className="text-left p-4">Category</th>

            <th className="text-left p-4">Teacher</th>

            <th className="text-left p-4">Lessons</th>

            <th className="text-left p-4">Price</th>

            <th className="text-left p-4">Status</th>

            <th className="text-center p-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {courses.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="text-center p-8 text-gray-500"
              >
                No courses found.
              </td>

            </tr>

          ) : (

            courses.map((course) => (

              <CourseRow
                key={course.id}
                course={course}
              />

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
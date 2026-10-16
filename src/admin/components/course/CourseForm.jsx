export default function CourseForm() {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <input
        type="text"
        placeholder="Course Title"
        className="border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="Instructor"
        className="border rounded-lg p-3"
      />

      <select className="border rounded-lg p-3">
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <input
        type="number"
        placeholder="Price"
        className="border rounded-lg p-3"
      />

      <textarea
        rows="5"
        placeholder="Course Description"
        className="border rounded-lg p-3 md:col-span-2"
      ></textarea>

      <button className="bg-blue-600 text-white rounded-lg py-3">
        Save Course
      </button>

    </div>
  );
}
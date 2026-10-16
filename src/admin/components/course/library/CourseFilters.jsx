export default function CourseFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      {/* Search */}

      <input
        type="text"
        placeholder="Search course..."
        className="border rounded-lg p-3"
      />

      {/* Category */}

      <select className="border rounded-lg p-3">

        <option>All Categories</option>
        <option>Grammar</option>
        <option>IELTS</option>
        <option>Vocabulary</option>
        <option>Conversation</option>
        <option>Stories</option>

      </select>

      {/* Status */}

      <select className="border rounded-lg p-3">

        <option>All Status</option>
        <option>Published</option>
        <option>Draft</option>

      </select>

      {/* Add Course */}

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
      >
        + New Course
      </button>

    </div>
  );
}
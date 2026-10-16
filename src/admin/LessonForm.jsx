function LessonForm() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-8">
        Add New Lesson
      </h2>

      <form className="space-y-6">

        {/* Lesson Title */}
        <div>
          <label className="block font-semibold mb-2">
            Lesson Title
          </label>

          <input
            type="text"
            placeholder="Example: Present Simple Tense"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-2">
            Category
          </label>

          <select className="w-full border rounded-lg p-3">
            <option>Courses</option>
            <option>IELTS</option>
            <option>Grammar</option>
            <option>Stories</option>
            <option>Podcasts</option>
            <option>Vocabulary</option>
            <option>Flashcards</option>
            <option>Conversation</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block font-semibold mb-2">
            Level
          </label>

          <select className="w-full border rounded-lg p-3">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            rows="5"
            className="w-full border rounded-lg p-3"
            placeholder="Write the lesson description..."
          ></textarea>
        </div>

        {/* YouTube */}
        <div>
          <label className="block font-semibold mb-2">
            YouTube Video URL
          </label>

          <input
            type="text"
            placeholder="https://youtube.com/..."
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* PDF */}
        <div>
          <label className="block font-semibold mb-2">
            Upload PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            className="w-full"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block font-semibold mb-2">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Save Lesson
        </button>

      </form>

    </div>
  );
}

export default LessonForm;
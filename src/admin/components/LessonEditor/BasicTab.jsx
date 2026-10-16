export default function BasicTab() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <label className="block font-semibold mb-2">
          Lesson Title
        </label>

        <input
          type="text"
          placeholder="Present Simple Tense"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Course
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Select Course</option>
          <option>Grammar Master</option>
          <option>IELTS Complete</option>
          <option>Conversation</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Section
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Select Section</option>
          <option>Unit 1</option>
          <option>Unit 2</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Category
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Grammar</option>
          <option>Vocabulary</option>
          <option>IELTS</option>
          <option>Podcast</option>
          <option>Story</option>
        </select>
      </div>

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

      <div>
        <label className="block font-semibold mb-2">
          Teacher
        </label>

        <input
          type="text"
          placeholder="Admin"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Lesson Duration
        </label>

        <input
          type="text"
          placeholder="20 minutes"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Lesson Order
        </label>

        <input
          type="number"
          placeholder="1"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold mb-2">
          Short Description
        </label>

        <textarea
          rows="5"
          placeholder="Write a short description..."
          className="w-full border rounded-lg p-3"
        ></textarea>
      </div>

    </div>
  );
}
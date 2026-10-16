export default function MediaTab() {
  return (
    <div className="mt-8 space-y-8">

      <div>
        <label className="block font-semibold mb-2">
          YouTube Video URL
        </label>

        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Upload Video
        </label>

        <input
          type="file"
          accept="video/*"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Upload Audio
        </label>

        <input
          type="file"
          accept="audio/*"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Upload PDF
        </label>

        <input
          type="file"
          accept=".pdf"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Lesson Thumbnail
        </label>

        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Downloadable Resources
        </label>

        <input
          type="file"
          multiple
          className="w-full border rounded-lg p-3"
        />
      </div>

    </div>
  );
}
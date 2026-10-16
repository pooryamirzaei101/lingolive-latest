import { useState } from "react";

export default function PDFSidebar() {
  const [activeTab, setActiveTab] = useState("contents");

  const contents = [
    "Introduction",
    "Chapter 1 - Present Simple",
    "Chapter 2 - Present Continuous",
    "Chapter 3 - Past Simple",
    "Chapter 4 - Future Tense",
    "Exercises",
    "Vocabulary",
    "Answers",
  ];

  const bookmarks = [
    "Page 5",
    "Page 28",
    "Page 67",
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">

      <h2 className="text-2xl font-bold mb-6">
        PDF Navigation
      </h2>

      {/* Tabs */}

      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setActiveTab("contents")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "contents"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Contents
        </button>

        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "bookmarks"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Bookmarks
        </button>

      </div>

      {/* Contents */}

      {activeTab === "contents" && (

        <div className="space-y-3">

          {contents.map((chapter, index) => (

            <button
              key={index}
              className="w-full text-left border rounded-lg p-3 hover:bg-blue-50 transition"
            >
              {chapter}
            </button>

          ))}

        </div>

      )}

      {/* Bookmarks */}

      {activeTab === "bookmarks" && (

        <div className="space-y-3">

          {bookmarks.map((bookmark, index) => (

            <button
              key={index}
              className="w-full text-left border rounded-lg p-3 hover:bg-yellow-50 transition"
            >
              ⭐ {bookmark}
            </button>

          ))}

        </div>

      )}

      {/* Info */}

      <div className="mt-8 border-t pt-6">

        <h3 className="font-bold mb-3">
          Reading Progress
        </h3>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-blue-600"
            style={{ width: "42%" }}
          />

        </div>

        <p className="text-gray-600 mt-3">
          42% completed
        </p>

      </div>

    </div>
  );
}
export default function ResourcesPanel() {
  const resources = [
    {
      id: 1,
      name: "Lesson PDF",
      type: "PDF",
      size: "2.4 MB",
      icon: "📄",
    },
    {
      id: 2,
      name: "Vocabulary List",
      type: "PDF",
      size: "850 KB",
      icon: "📚",
    },
    {
      id: 3,
      name: "Audio Practice",
      type: "MP3",
      size: "8.1 MB",
      icon: "🎧",
    },
    {
      id: 4,
      name: "Worksheet",
      type: "PDF",
      size: "1.3 MB",
      icon: "📝",
    },
    {
      id: 5,
      name: "Lesson Subtitles",
      type: "SRT",
      size: "35 KB",
      icon: "💬",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Lesson Resources
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          {resources.length} Files
        </span>

      </div>

      <div className="space-y-4">

        {resources.map((resource) => (

          <div
            key={resource.id}
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border rounded-xl p-5 hover:shadow-md transition"
          >

            <div className="flex items-center gap-5">

              <div className="text-4xl">
                {resource.icon}
              </div>

              <div>

                <h3 className="text-xl font-semibold">
                  {resource.name}
                </h3>

                <p className="text-gray-500">
                  {resource.type} • {resource.size}
                </p>

              </div>

            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
              Download
            </button>

          </div>

        ))}

      </div>

      <div className="mt-10 bg-green-50 border border-green-200 rounded-lg p-5">

        <h3 className="font-bold text-lg mb-2">
          📦 Resource Center
        </h3>

        <p>
          Every lesson can include downloadable PDFs, worksheets,
          subtitles, vocabulary lists, audio files, ZIP archives,
          and any other learning materials.
        </p>

      </div>

    </div>
  );
}
export default function NowPlaying() {
  const currentAudio = {
    title: "Present Simple Listening Practice",
    course: "English Grammar Masterclass",
    teacher: "John Smith",
    duration: "15:45",
    type: "Podcast",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Cover */}

        <div className="w-48 h-48 rounded-xl bg-blue-100 flex items-center justify-center text-7xl">

          🎧

        </div>

        {/* Information */}

        <div className="flex-1">

          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold">
            {currentAudio.type}
          </span>

          <h2 className="text-3xl font-bold mt-4">
            {currentAudio.title}
          </h2>

          <p className="text-gray-600 mt-3">
            Course: {currentAudio.course}
          </p>

          <p className="text-gray-600">
            Teacher: {currentAudio.teacher}
          </p>

          <p className="text-gray-600">
            Duration: {currentAudio.duration}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
              ▶ Resume
            </button>

            <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
              ⭐ Favorite
            </button>

            <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
              ⬇ Download
            </button>

          </div>

        </div>

      </div>

      {/* Listening Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

        <div className="bg-gray-50 rounded-lg p-5 text-center">

          <div className="text-3xl mb-2">
            🎧
          </div>

          <p className="font-semibold">
            Audio Lesson
          </p>

        </div>

        <div className="bg-gray-50 rounded-lg p-5 text-center">

          <div className="text-3xl mb-2">
            📚
          </div>

          <p className="font-semibold">
            Grammar
          </p>

        </div>

        <div className="bg-gray-50 rounded-lg p-5 text-center">

          <div className="text-3xl mb-2">
            🌍
          </div>

          <p className="font-semibold">
            Listening
          </p>

        </div>

        <div className="bg-gray-50 rounded-lg p-5 text-center">

          <div className="text-3xl mb-2">
            ⭐
          </div>

          <p className="font-semibold">
            Beginner
          </p>

        </div>

      </div>

    </div>
  );
}
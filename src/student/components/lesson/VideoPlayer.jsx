import { useState } from "react";

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* Video Area */}

      <div className="relative bg-black aspect-video flex items-center justify-center">

        <div className="text-center text-white">

          <div className="text-7xl mb-5">
            ▶
          </div>

          <h2 className="text-2xl font-bold">
            Lesson Video
          </h2>

          <p className="text-gray-300 mt-3">
            YouTube or uploaded video will appear here
          </p>

        </div>

      </div>

      {/* Controls */}

      <div className="p-6">

        <div className="flex flex-wrap justify-between items-center gap-6">

          <div className="flex gap-3">

            <button
              onClick={() => setPlaying(!playing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>

            <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
              ⏮ Previous
            </button>

            <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
              ⏭ Next
            </button>

          </div>

          <div className="flex items-center gap-4">

            <label className="font-semibold">
              Speed
            </label>

            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option>0.5x</option>
              <option>0.75x</option>
              <option>1x</option>
              <option>1.25x</option>
              <option>1.5x</option>
              <option>2x</option>
            </select>

          </div>

        </div>

        {/* Timeline */}

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-500 mb-2">

            <span>04:25</span>

            <span>18:40</span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full">

            <div
              className="h-3 bg-blue-600 rounded-full"
              style={{ width: "24%" }}
            />

          </div>

        </div>

        {/* Video Information */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

          <div className="border rounded-lg p-4 text-center">

            <div className="text-3xl mb-2">
              🎥
            </div>

            <p className="font-semibold">
              HD Video
            </p>

          </div>

          <div className="border rounded-lg p-4 text-center">

            <div className="text-3xl mb-2">
              📝
            </div>

            <p className="font-semibold">
              Subtitles
            </p>

          </div>

          <div className="border rounded-lg p-4 text-center">

            <div className="text-3xl mb-2">
              🌍
            </div>

            <p className="font-semibold">
              Multi-language
            </p>

          </div>

          <div className="border rounded-lg p-4 text-center">

            <div className="text-3xl mb-2">
              📺
            </div>

            <p className="font-semibold">
              Fullscreen
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}s
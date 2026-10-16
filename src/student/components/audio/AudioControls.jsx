import { useState } from "react";

export default function AudioControls() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1x");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex flex-wrap justify-between items-center gap-6">

        {/* Playback */}

        <div className="flex gap-3">

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            ⏮
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            ⏭
          </button>

        </div>

        {/* Progress */}

        <div className="flex-1 min-w-[250px]">

          <div className="flex justify-between text-sm text-gray-500 mb-2">

            <span>02:18</span>

            <span>15:45</span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600"
              style={{ width: "18%" }}
            />

          </div>

        </div>

        {/* Speed */}

        <div className="flex items-center gap-3">

          <span className="font-semibold">
            Speed
          </span>

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

      <div className="flex flex-wrap gap-3 mt-6">

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          🔁 Repeat
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          🔀 Shuffle
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          🔊 Volume
        </button>

      </div>

    </div>
  );
}
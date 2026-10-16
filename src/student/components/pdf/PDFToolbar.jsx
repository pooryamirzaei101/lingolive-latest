import { useState } from "react";

export default function PDFToolbar() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex gap-3">

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            ⬅ Previous
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Next ➡
          </button>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setZoom((z) => Math.max(50, z - 10))
            }
            className="border px-3 py-2 rounded-lg"
          >
            −
          </button>

          <span className="font-bold">
            {zoom}%
          </span>

          <button
            onClick={() =>
              setZoom((z) => Math.min(200, z + 10))
            }
            className="border px-3 py-2 rounded-lg"
          >
            +
          </button>

        </div>

        <div className="flex gap-3">

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            ⬇ Download
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            🖨 Print
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            ⭐ Bookmark
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            ⛶ Fullscreen
          </button>

        </div>

      </div>

    </div>
  );
}
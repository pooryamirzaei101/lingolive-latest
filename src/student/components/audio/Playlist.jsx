import { useState } from "react";

export default function Playlist() {
  const [currentTrack, setCurrentTrack] = useState(1);

  const tracks = [
    {
      id: 1,
      title: "Present Simple Listening Practice",
      duration: "15:45",
      completed: true,
    },
    {
      id: 2,
      title: "Present Continuous Listening",
      duration: "18:20",
      completed: false,
    },
    {
      id: 3,
      title: "Past Simple Conversation",
      duration: "12:55",
      completed: false,
    },
    {
      id: 4,
      title: "Daily English Podcast",
      duration: "22:30",
      completed: false,
    },
    {
      id: 5,
      title: "Vocabulary Listening Challenge",
      duration: "16:40",
      completed: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Playlist
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          {tracks.length} Tracks
        </span>

      </div>

      <div className="space-y-4">

        {tracks.map((track) => (

          <button
            key={track.id}
            onClick={() => setCurrentTrack(track.id)}
            className={`w-full text-left border rounded-xl p-5 transition ${
              currentTrack === track.id
                ? "border-blue-600 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-bold text-lg">
                  {track.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {track.duration}
                </p>

              </div>

              <div className="flex items-center gap-3">

                {track.completed && (
                  <span className="text-green-600 font-semibold">
                    ✅ Completed
                  </span>
                )}

                {currentTrack === track.id && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                    Playing
                  </span>
                )}

              </div>

            </div>

          </button>

        ))}

      </div>

      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-5">

        <h3 className="font-bold text-lg mb-2">
          🎧 Listening Playlist
        </h3>

        <p>
          Students can listen to lessons in order or jump directly to
          any track. Their listening progress will be saved automatically
          after we connect Supabase in Phase 7.
        </p>

      </div>

    </div>
  );
}
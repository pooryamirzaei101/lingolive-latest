import AudioControls from "./AudioControls";
import NowPlaying from "./NowPlaying";
import Playlist from "./Playlist";

export default function AudioPlayer() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

      {/* Now Playing */}

      <NowPlaying />

      {/* Audio Controls */}

      <AudioControls />

      {/* Playlist */}

      <Playlist />

    </div>
  );
}
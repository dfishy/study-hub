import React from 'react';
import { useMusic } from '../context/musiccontext';

const MusicPlayer = () => {
  const { isPlaying, toggleMusic, nextTrack, trackIndex, tracks } = useMusic();

  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={toggleMusic}
        className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
      >
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>
      <button
        onClick={nextTrack}
        className="px-4 py-2 bg-purple-400 text-white rounded-xl hover:bg-purple-500"
      >
        Next Track
      </button>
      <span className="text-purple-800 font-bold">
        Now Playing: Track {trackIndex + 1}
      </span>
    </div>
  );
};

export default MusicPlayer;

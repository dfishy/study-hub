import React from 'react';
import { useMusic } from '../context/musiccontext';

const MusicPlayer = () => {
  const { isPlaying, toggleMusic, nextTrack, trackIndex, tracks } = useMusic();

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-purple-200 z-50">
      <button
        onClick={toggleMusic}
        className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      <button
        onClick={nextTrack}
        className="px-4 py-2 bg-purple-400 text-white rounded-xl hover:bg-purple-500 transition-colors"
      >
        ⏭ Next
      </button>
      <div className="flex flex-col">
        <span className="text-purple-800 font-bold text-sm">
          {tracks[trackIndex].title}
        </span>
        <span className="text-purple-600 text-xs">
          {trackIndex + 1} of {tracks.length}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
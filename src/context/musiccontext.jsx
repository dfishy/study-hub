import { createContext, useContext, useState, useRef } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const tracks = [
    'https://assets.mixkit.co/active_storage/sfx/preview/mixkit-meditation-bells-echo-1.mp3',
    'https://assets.mixkit.co/active_storage/sfx/preview/mixkit-relaxing-ambient-music-1.mp3'
  ];

  const audioRef = useRef(new Audio(tracks[trackIndex]));

  // Play / Pause toggle
  const toggleMusic = () => {
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  // Switch track
  const nextTrack = () => {
    audioRef.current.pause();
    const nextIndex = (trackIndex + 1) % tracks.length;
    setTrackIndex(nextIndex);
    audioRef.current.src = tracks[nextIndex];
    if (isPlaying) audioRef.current.play();
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, nextTrack, trackIndex, tracks }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);

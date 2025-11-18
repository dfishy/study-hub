import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  // Replace with your actual music files from public/music folder
  const tracks = [
    { title: 'Lofi 1', src: '/music/lofi1.mp3' },
    { title: 'Lofi 2', src: '/music/lofi2.mp3' },
    { title: 'Lofi 3', src: '/music/lofi3.mp3' },
    { title: 'Lofi 4', src: '/music/lofi4.mp3' },
  ];

  const audioRef = useRef(new Audio(tracks[trackIndex].src));

  // Handle track end - auto play next
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTrackEnd = () => {
      nextTrack();
    };

    audio.addEventListener('ended', handleTrackEnd);
    
    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [trackIndex]);

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
    audioRef.current.src = tracks[nextIndex].src;
    if (isPlaying) audioRef.current.play();
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, nextTrack, trackIndex, tracks }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
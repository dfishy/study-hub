import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const tracks = [
    { title: 'Lofi 1', src: '/music/lofi1.mp3' },
    { title: 'Lofi 2', src: '/music/lofi2.mp3' },
    { title: 'Lofi 3', src: '/music/lofi3.mp3' },
    { title: 'Lofi 4', src: '/music/lofi4.mp3' },
  ];

  // changed to fix bug
  // was const audioRef = useRef(new Audio(tracks[trackIndex].src));
  const audioRef = useRef(new Audio(tracks[0].src));

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[trackIndex].src;
    audio.load();
    
    if (isPlaying) {
      audio.play().catch(err => console.error('Play failed:', err));
    }
  }, [trackIndex]);


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

  const toggleMusic = () => {
    const audio = audioRef.current;
    audio.load();
    
    if (!isPlaying) {
      audio.play().catch(err => {
        console.error('Play failed:', err);
      });
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Switch track
  const nextTrack = () => {
    audioRef.current.pause();
    setTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, nextTrack, trackIndex, tracks }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
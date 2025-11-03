import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  // STATE MANAGEMENT SECTION
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [showTransitionModal, setShowTransitionModal] = useState(false); 
  
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      // Play sound 3 seconds before timer ends
      if (timeLeft === 2 && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } 
    // Handle timer completion
    else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      
      // Wait a moment then pause and show modal
      setTimeout(() => {
        setIsActive(false);
        setShowTransitionModal(true);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isStudyTime, studyTime, breakTime]);


  // NEW FUNCTION: Handle user confirmation to switch modes
  const confirmTransition = () => {
    if (isStudyTime) {
      setTimeLeft(breakTime * 60);
      setIsStudyTime(false);
    } else {
      setTimeLeft(studyTime * 60);
      setIsStudyTime(true);
    }
    setShowTransitionModal(false);
  };

  // Timer control functions (existing)
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isStudyTime ? studyTime * 60 : breakTime * 60);
  };

  const fullResetTimer = () => {
    setIsActive(false);
    setIsStudyTime(true);
    setTimeLeft(studyTime * 60);
  };

  const updateStudyTime = (newTime) => {
    setStudyTime(newTime);
    if (!isActive && isStudyTime) {
      setTimeLeft(newTime * 60);
    }
  };

  const updateBreakTime = (newTime) => {
    setBreakTime(newTime);
    if (!isActive && !isStudyTime) {
      setTimeLeft(newTime * 60);
    }
  };

  const value = {
    studyTime,
    breakTime,
    timeLeft,
    isActive,
    isStudyTime,
    showTransitionModal,      // NEW
    confirmTransition,        // NEW
    toggleTimer,
    resetTimer,
    fullResetTimer,
    updateStudyTime,
    updateBreakTime,
    audioRef
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
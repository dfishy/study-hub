import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

/**
 * TIMER CONTEXT
 * Provides global timer state management so timer continues running
 * even when user switches between different tabs in the application
 */
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
  // These state variables control the entire timer behavior
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isStudyTime, setIsStudyTime] = useState(true);
  
  const audioRef = useRef(null);

  /**
   * CORE TIMER LOGIC - useEffect Hook
   * This runs globally and persists across tab changes
   */
  useEffect(() => {
    let interval = null;
    
    // Only run timer if active and time hasn't expired
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } 
    // Handle timer completion and mode switching
    else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      
      // Play notification sound when session ends
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      
      // Switch between study and break modes
      if (isStudyTime) {
        // Transition to break time
        setTimeLeft(breakTime * 60);
        setIsStudyTime(false);
      } else {
        // Transition back to study time
        setTimeLeft(studyTime * 60);
        setIsStudyTime(true);
      }
    }
    
    // Cleanup function - crucial for preventing memory leaks
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isStudyTime, studyTime, breakTime]);

  // Timer control functions
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

  // Update study time
  const updateStudyTime = (newTime) => {
    setStudyTime(newTime);
    if (!isActive && isStudyTime) {
      setTimeLeft(newTime * 60);
    }
  };

  // Update break time
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
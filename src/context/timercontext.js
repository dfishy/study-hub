import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

/**
 * TIMER CONTEXT
 * Provides global timer state management AND goal tracking
 * Timer continues running even when user switches tabs
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
  // TIMER STATE
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  
  // GOALS STATE
  const [goals, setGoals] = useState([
  ]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  // SESSION TRACKING
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionStartMinutes, setSessionStartMinutes] = useState(null);
  
  const audioRef = useRef(null);

  /**
   * CORE TIMER LOGIC
   */
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      // Play sound 3 seconds before timer ends
      if (timeLeft === 3 && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } 
    else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      
      // Wait a moment then pause and show modal
      setTimeout(() => {
        setIsActive(false);
        setShowTransitionModal(true);
        
        // Track completed study time if in study mode and goal selected
        if (isStudyTime && selectedGoal && sessionStartMinutes !== null) {
          const minutesStudied = sessionStartMinutes - 0; // time that was on timer when started
          addTimeToGoal(selectedGoal, minutesStudied);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isStudyTime, studyTime, breakTime, selectedGoal, sessionStartMinutes]);

  /**
   * TIMER CONTROL FUNCTIONS
   */
  const toggleTimer = () => {
    if (!isActive && isStudyTime) {
      // Starting a study session
      setSessionStartTime(Date.now());
      setSessionStartMinutes(timeLeft / 60);
    } else if (isActive && isStudyTime && selectedGoal && sessionStartMinutes !== null) {
      // Pausing a study session - save progress
      const minutesStudied = sessionStartMinutes - (timeLeft / 60);
      if (minutesStudied > 0) {
        addTimeToGoal(selectedGoal, minutesStudied);
      }
      setSessionStartMinutes(timeLeft / 60); // Update for next pause
    }
    
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isStudyTime ? studyTime * 60 : breakTime * 60);
    setSessionStartMinutes(null);
  };

  const fullResetTimer = () => {
    setIsActive(false);
    setIsStudyTime(true);
    setTimeLeft(studyTime * 60);
    setSessionStartMinutes(null);
  };

  const confirmTransition = () => {
    if (isStudyTime) {
      setTimeLeft(breakTime * 60);
      setIsStudyTime(false);
    } else {
      setTimeLeft(studyTime * 60);
      setIsStudyTime(true);
    }
    setShowTransitionModal(false);
    setSessionStartMinutes(null);
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

  /**
   * GOAL MANAGEMENT FUNCTIONS
   */
  const addGoal = (name, targetHours) => {
    const newGoal = {
      id: Date.now(),
      name: name.trim(),
      targetHours: parseInt(targetHours),
      completedMinutes: 0
    };
    setGoals([...goals, newGoal]);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    if (selectedGoal === id) {
      setSelectedGoal(null);
    }
  };

  const addTimeToGoal = (goalId, minutes) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, completedMinutes: goal.completedMinutes + minutes }
          : goal
      )
    );
  };

  const value = {
    // Timer values
    studyTime,
    breakTime,
    timeLeft,
    isActive,
    isStudyTime,
    showTransitionModal,
    toggleTimer,
    resetTimer,
    fullResetTimer,
    confirmTransition,
    updateStudyTime,
    updateBreakTime,
    audioRef,
    // Goal values
    goals,
    selectedGoal,
    setSelectedGoal,
    addGoal,
    deleteGoal
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
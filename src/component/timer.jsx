import React, { useState, useEffect, useRef } from 'react';
import Clock from './clock';

/**
 * TIMER COMPONENT - Core Study Hub Functionality
 * 
 * This component manages the Pomodoro timer functionality including:
 * - Study/break timing cycles
 * - User controls (start, pause, reset)
 * - Custom time configuration
 * - State management between study and break modes
 * 
 * Complexity Factors:
 * - Multiple interdependent state variables
 * - Real-time countdown with useEffect hooks
 * - Input validation and error handling
 * - Audio notification system
 */
const Timer = () => {
  // STATE MANAGEMENT SECTION
  // These state variables control the entire timer behavior
  
  /**
   * studyTime: Duration of study sessions in minutes
   * breakTime: Duration of break sessions in minutes  
   * timeLeft: Remaining time in seconds for current session
   * isActive: Whether timer is currently running
   * isStudyTime: Whether current session is study (true) or break (false)
   */
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [customStudyInput, setCustomStudyInput] = useState('');
  const [customBreakInput, setCustomBreakInput] = useState('');


  /**
   * CORE TIMER LOGIC - useEffect Hook
   * 
   * This is the most complex part of the application. It handles:
   * - Real-time countdown using setInterval
   * - Automatic switching between study/break modes
   * - Cleanup to prevent memory leaks
   * 
   * Dependencies array ensures proper updates when state changes
   */
  useEffect(() => {
    let interval = null;
    
    // Only run timer if active and time hasn't expired
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } 
    // Handle timer completion and mode switching
    else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      
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
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isStudyTime, studyTime, breakTime]);

  /**
   * TIMER CONTROL FUNCTIONS
   * These functions provide the user interface for timer manipulation
   */

  // Toggles timer between running and paused states
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Resets current session without changing mode
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isStudyTime ? studyTime * 60 : breakTime * 60);
  };

  // Completely resets timer to initial study mode
  const fullResetTimer = () => {
    setIsActive(false);
    setIsStudyTime(true);
    setTimeLeft(studyTime * 60);
  };

  /**
   * INPUT VALIDATION FUNCTIONS
   * Ensure user inputs are valid and safe to use
   */

  // Validates and updates study time input
  const handleStudyTimeChange = (e) => {
    const value = e.target.value;
    setCustomStudyInput(value);
    const numValue = parseInt(value, 10);
    
    // Only update if input is valid positive number
    if (!isNaN(numValue) && numValue > 0) {
      setStudyTime(numValue);
      // Update displayed time if not active and in study mode
      if (!isActive && isStudyTime) {
        setTimeLeft(numValue * 60);
      }
    }
  };

  // Validates and updates break time input
  const handleBreakTimeChange = (e) => {
    const value = e.target.value;
    setCustomBreakInput(value);
    const numValue = parseInt(value, 10);
    
    // Input validation for positive numbers
    if (!isNaN(numValue) && numValue > 0) {
      setBreakTime(numValue);
      if (!isActive && !isStudyTime) {
        setTimeLeft(numValue * 60);
      }
    }
  };

  /**
   * DYNAMIC STYLING
   * Changes appearance based on current mode (study/break)
   */
  const timerModeClass = isStudyTime
    ? 'bg-amber-100 text-amber-900'  // Study mode - warm colors
    : 'bg-pink-100 text-pink-900';   // Break mode - cool colors

  return (
    // Main container with dynamic styling based on current mode
    <div className={`flex flex-col items-center justify-center p-8 rounded-3xl shadow-lg transition-colors duration-500 ${timerModeClass}`}>
      
      
      {/* CLOCK COMPONENT */}
      {/* Displays time visually with analog clock and digital readout */}
      <Clock timeLeft={timeLeft} isStudyTime={isStudyTime} isActive={isActive} />
      
      {/* CONTROL BUTTONS SECTION */}
      {/* Provides user interface for timer manipulation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Start/Pause Button - Toggles timer state */}
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-xl text-white font-['VT323'] text-xl shadow-md transition hover:scale-105 ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>
        
        {/* Reset Button - Restarts current session */}
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-gray-500 text-white rounded-xl font-['VT323'] text-xl shadow-md transition hover:bg-gray-600 hover:scale-105"
          aria-label="Reset current session"
        >
          RESET ROUND
        </button>
        
        {/* Full Reset Button - Returns to initial study mode */}
        <button
          onClick={fullResetTimer}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-['VT323'] text-xl shadow-md transition hover:bg-blue-600 hover:scale-105"
          aria-label="Full reset to study mode"
        >
          FULL RESET
        </button>
      </div>
      
      {/* TIME CONFIGURATION SECTION */}
      {/* Allows users to customize study and break durations */}
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
        
        {/* Study Time Input */}
        <div className="flex flex-col items-center">
          <label htmlFor="studyTime" className="mb-2 font-['VT323'] font-medium">
            Study Time (min):
          </label>
          <input
            type="number"
            id="studyTime"
            min="1"
            value={customStudyInput}
            placeholder={studyTime.toString()}
            onChange={handleStudyTimeChange}
            className="w-24 px-3 py-2 border border-amber-300 rounded-lg text-center font-['VT323'] text-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            disabled={isActive} // Prevent changes during active timer
            aria-label="Set study time in minutes"
          />
        </div>
        
        {/* Break Time Input */}
        <div className="flex flex-col items-center">
          <label htmlFor="breakTime" className="mb-2 font-['VT323'] font-medium">
            Break Time (min):
          </label>
          <input
            type="number"
            id="breakTime"
            min="1"
            value={customBreakInput}
            placeholder={breakTime.toString()}
            onChange={handleBreakTimeChange}
            className="w-24 px-3 py-2 border border-pink-300 rounded-lg text-center font-['VT323'] text-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            disabled={isActive} // Prevent changes during active timer
            aria-label="Set break time in minutes"
          />
        </div>
      </div>
      
      {/* ERROR DISPLAY */}
      {/* Shows validation errors for invalid inputs */}
      {(customStudyInput <= 0 || customBreakInput <= 0) && (
        <p className="text-red-500 mt-4 text-sm font-['VT323']">
          Please enter a positive number.
        </p>
      )}
    </div>
  );
};

export default Timer;
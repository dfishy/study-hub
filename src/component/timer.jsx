import React, { useState, /*useEffect, useRef*/ } from 'react';
import Clock from './clock';
import { useTimer } from '../context/timercontext';

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
 * 
 * This component displays the timer interface and uses global timer state
 * Timer continues running even when user navigates to other tabs
 */
const Timer = () => {
  // Get timer state and functions from global context
  const {
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
  } = useTimer();

  // Local state for input fields
  const [customStudyInput, setCustomStudyInput] = useState('');
  const [customBreakInput, setCustomBreakInput] = useState('');

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
      updateStudyTime(numValue);
    }
  };

  // Validates and updates break time input
  const handleBreakTimeChange = (e) => {
    const value = e.target.value;
    setCustomBreakInput(value);
    const numValue = parseInt(value, 10);
    
    // Input validation for positive numbers
    if (!isNaN(numValue) && numValue > 0) {
      updateBreakTime(numValue);
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
      
      {/* WILL BE ADDED!!! Hidden audio element for session completion notifications */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      
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
        <p className="text-red-500 mt-4 text-sm font-['VT-23']">
          Please enter a positive number.
        </p>
      )}
    </div>
  );
};

export default Timer;
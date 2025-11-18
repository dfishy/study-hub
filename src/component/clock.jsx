import React from 'react';
import { useTimer } from '../context/timercontext'; 

/**
 * CLOCK COMPONENT - Timer Visualization
 * 
 * Progress-based timer display that uses actual timer values from context
 */
const Clock = ({ timeLeft, isStudyTime, isActive }) => {
  const { studyTime, breakTime } = useTimer(); // Get actual times from context
  
  // Convert timeLeft (seconds) to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate progress percentage (0 to 1) using actual times
  const totalSeconds = isStudyTime ? (studyTime * 60) : (breakTime * 60);
  const progress = timeLeft / totalSeconds;
  
  // Circle dimensions
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);
  
  // Dynamic colors based on mode and time remaining
  const getColors = () => {
    if (!isActive) {
      return {
        ring: '#d1d5db', // gray when paused
        background: '#f3f4f6',
        text: '#6b7280'
      };
    }
    
    if (isStudyTime) {
      // Study mode - warm colors that get more urgent as time runs out
      if (progress > 0.5) return { ring: '#10b981', background: '#ecfdf5', text: '#065f46' }; // green
      if (progress > 0.25) return { ring: '#f59e0b', background: '#fffbeb', text: '#92400e' }; // amber
      return { ring: '#ef4444', background: '#fef2f2', text: '#991b1b' }; // red when low time
    } else {
      // Break mode - cool colors
      if (progress > 0.5) return { ring: '#3b82f6', background: '#eff6ff', text: '#1e40af' }; // blue
      if (progress > 0.25) return { ring: '#8b5cf6', background: '#faf5ff', text: '#5b21b6' }; // purple
      return { ring: '#ec4899', background: '#fdf2f8', text: '#9d174d' }; // pink when low time
    }
  };
  
  const colors = getColors();
  
  // Format time for display
  const formatTime = () => {
    if (minutes === 0 && seconds === 0) return '00:00';
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get status text
  const getStatusText = () => {
    if (!isActive) return 'PAUSED';
    if (timeLeft === 0) return 'TIME\'S UP!';
    return isStudyTime ? 'STUDY TIME' : 'BREAK TIME';
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      {/* Progress Ring Container */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.background}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.ring}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Main Time Display */}
          <div 
            className="text-6xl font-['VT323'] font-bold mb-2 transition-colors duration-500"
            style={{ color: colors.text }}
          >
            {formatTime()}
          </div>
          
          {/* Status Text */}
          <div 
            className="text-xl font-['VT323'] uppercase tracking-wider transition-colors duration-500"
            style={{ color: colors.text }}
          >
            {getStatusText()}
          </div>
          
          {/* Progress Percentage */}
          <div 
            className="text-lg font-['VT323'] mt-2 opacity-70 transition-colors duration-500"
            style={{ color: colors.text }}
          >
            {Math.round(progress * 100)}%
          </div>
        </div>
      </div>
      
      {/* Mode Indicator */}
      <div className={`mt-6 px-6 py-3 rounded-2xl font-['VT323'] text-xl uppercase tracking-wide ${
        isStudyTime 
          ? 'bg-amber-100 text-amber-900 border-2 border-amber-300' 
          : 'bg-pink-100 text-pink-900 border-2 border-pink-300'
      } transition-colors duration-500`}>
        {isStudyTime ? '📚 Study Session' : '☕ Break Time'}
      </div>
      
    </div>
  );
};

export default Clock;
import React from 'react';

/**
 * CLOCK COMPONENT - Visual Time Representation
 * 
 * This component creates an analog clock display that shows:
 * - Current time remaining in the session
 * - Visual distinction between the study and break modes
 * - Smooth animations for clock hands
 * - Digital readout for precise timing
 * 
 * Complexity Factors:
 * - Mathematical calculations for hand positioning
 * - Coordinate system transformations
 * - Real-time angle calculations
 * - Responsive rendering with CSS
 */

const Clock = ({ timeLeft, isStudyTime, isActive }) => {
  // Convert seconds to hours, minutes, seconds for the clock display
  const totalSeconds = timeLeft;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Convert time units into rotation angles for clock hands
  // Angles are calculated in degrees
  
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours % 12) + minutes / 60) / 12 * 360;

  // Format time for the digital display
  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clock numbers (12, 1, 2, 3, etc.), may change to a slice style instead of hour display
  const clockNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Analog Clock */}
      <div className="relative mb-4">
        <div className="analog-clock">
          {/* Clock numbers */}
          {clockNumbers.map((number, index) => {
            const angle = (index * 30) - 90; //Convert index to angle (-90° starts at top) 
            const radius = 70; // Distance from center
            const x = 50 + radius * Math.cos(angle * Math.PI / 180);
            const y = 50 + radius * Math.sin(angle * Math.PI / 180);
            
            return (
              <div
                key={number}
                className="absolute text-amber-900 font-['VT323'] text-lg font-bold pointer-events-none"
                style={{
                  left: `${x}%`, // Position using percentages for responsiveness
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)' // Should center the number elements
                }}
              >
                {number}
              </div>
            );
          })}
          
          
          
          {/* Hour hand */}
          <div 
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
              width: '8px',
              height: '50px',
              backgroundColor: '#dc2626',
              borderRadius: '4px 4px 2px 2px',
              zIndex: 30 // Highest z-index (on top)
            }}
          />
          
          {/* Minute hand */}
          <div 
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
              width: '6px',
              height: '70px',
              backgroundColor: '#2563eb',
              borderRadius: '3px 3px 2px 2px',
              zIndex: 20 // Middle z-index
            }}
          />
          
          {/* Second hand */}
          <div 
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
              width: '2px',
              height: '80px',
              backgroundColor: '#16a34a',
              borderRadius: '1px',
              zIndex: 10 // Lowest z-index
            }}
          />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-white" />
        </div>
        
        {/* Mode indicator around the clock that changes with study and break */}
        <div className={`absolute -inset-4 rounded-full border-4 ${
          isStudyTime ? 'border-amber-300' : 'border-pink-300'
        } opacity-60 pointer-events-none`} />
      </div>

      {/* Digital Display */}
      <div className="text-center mt-6">
        <div className="font-['VT323'] text-4xl md:text-5xl text-amber-900 mb-2 tracking-wide bg-amber-200 px-4 py-2 rounded-lg border-2 border-amber-300">
          {formatTime(timeLeft)}
        </div>
        <div className={`font-['VT323'] text-lg ${
          isStudyTime ? 'text-amber-700' : 'text-pink-700'
        } font-medium px-3 py-1 rounded-full ${
          isStudyTime ? 'bg-amber-200' : 'bg-pink-200'
        }`}>
          {isStudyTime ? '📚 STUDY MODE' : '☕ BREAK TIME'}
          {!isActive && ' ⏸️ PAUSED'}
        </div>
      </div>
    </div>
  );
};

export default Clock;
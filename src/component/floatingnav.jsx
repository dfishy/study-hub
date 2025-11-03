import React, { useState, useRef, useEffect } from 'react';

/**
 * FLOATING NAVIGATION COMPONENT
 * 
 * Features:
 * - Draggable toolbar that can be moved around the screen
 * - Smooth animations for dragging and tab switching
 * - Collapsible interface to save space
 * - Prevents overlapping with screen edges and content
 * - Horizontal layout when dragged to top of screen
 */
const FloatingNav = ({ activeTab, onTabChange }) => {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const navRef = useRef(null);

  // Available tabs for navigation
  const tabs = [
    { id: 'timer', label: 'Timer', icon: '⏰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'todo', label: 'To Do', icon: '📝' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'whiteboard', label: 'Whiteboard', icon: '🖊️' }
  ];

  /**
   * DRAG HANDLING LOGIC
   * Enables smooth dragging while preventing toolbar from leaving screen bounds
   */
  const handleMouseDown = (e) => {
    // Only start drag when clicking on the header area, not tabs
    if (e.target.closest('.nav-tab')) return;
    
    setIsDragging(true);
    const rect = navRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate toolbar dimensions based on state
    const toolbarWidth = isHorizontal ? 380 : (isCollapsed ? 70 : 200);
    const toolbarHeight = isHorizontal ? 65 : (isCollapsed ? 280 : 320);

    // Prevent toolbar from being dragged off-screen with dynamic bounds
    const boundedX = Math.max(10, Math.min(newX, viewportWidth - toolbarWidth - 10));
    const boundedY = Math.max(10, Math.min(newY, viewportHeight - toolbarHeight - 10));

    setPosition({ x: boundedX, y: boundedY });

    // Auto-switch to horizontal layout when near top of screen
    const shouldBeHorizontal = boundedY < 100;
    if (shouldBeHorizontal !== isHorizontal) {
      setIsHorizontal(shouldBeHorizontal);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset, isHorizontal, isCollapsed]);

  /**
   * TAB NAVIGATION
   * Smooth scrolling and tab switching with visual feedback
   */
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  // Calculate dynamic dimensions based on state
  const getToolbarDimensions = () => {
    if (isHorizontal) {
      return {
        width: isCollapsed ? '220px' : '380px',
        height: '65px'
      };
    } else {
      return {
        width: isCollapsed ? '70px' : '200px',
        height: isCollapsed ? '280px' : '320px'
      };
    }
  };

  const dimensions = getToolbarDimensions();

  return (
    <div
      ref={navRef}
      className={`fixed z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-amber-200/60 transition-all duration-300 ${
        isDragging ? 'shadow-amber-300/50' : 'shadow-amber-200/30'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: dimensions.width,
        height: dimensions.height,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with drag handle and collapse button */}
      <div className={`flex items-center justify-between p-2 border-b border-amber-200/50 cursor-grab active:cursor-grabbing ${
        isHorizontal ? 'flex-row h-7' : 'flex-col h-8'
      }`}>
        <div className="flex items-center space-x-1">
          {/* Colored dots - visual indicator for draggable area */}
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-amber-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-amber-200 rounded-full"></div>
        </div>
        
        {/* Collapse/Expand Button - now properly contained */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-amber-100 transition-colors text-xs"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isHorizontal ? (isCollapsed ? '▶' : '◀') : (isCollapsed ? '▼' : '▲')}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={`overflow-hidden ${
        isHorizontal 
          ? 'flex flex-row items-center justify-center h-[calc(100%-1.75rem)] px-1 space-x-1' 
          : 'flex flex-col h-[calc(100%-2rem)] p-1 space-y-1'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`nav-tab flex items-center justify-center transition-all duration-200 ${
              isHorizontal 
                ? `rounded-lg ${isCollapsed ? 'w-8 h-8' : 'flex-1 h-9 mx-0.5 px-2'}`
                : `rounded-lg ${isCollapsed ? 'w-full h-10' : 'w-full h-11 px-2'}`
            } ${
              activeTab === tab.id
                ? 'bg-amber-100 text-amber-900 shadow-inner border border-amber-300'
                : 'text-amber-700 hover:bg-amber-50 hover:shadow-sm border border-transparent'
            }`}
          >
            <span className={`${isHorizontal && !isCollapsed ? 'text-sm' : 'text-base'}`}>
              {tab.icon}
            </span>
            {!isCollapsed && (
              <span className={`font-['VT323']  font-medium truncate ${
                isHorizontal ? 'text-xs ml-1' : 'text-sm ml-2'
              }`}>
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  );
};

export default FloatingNav;
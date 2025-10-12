import React, { useState, useRef, useEffect } from 'react';

/**
 * FLOATING NAVIGATION COMPONENT
 * 
 * Features:
 * - Draggable toolbar that can be moved around the screen
 * - Smooth animations for dragging and tab switching
 * - Collapsible interface to save space
 * - Prevents overlapping with screen edges and content
 */
const FloatingNav = ({ activeTab, onTabChange }) => {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
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

    // Prevent toolbar from being dragged off-screen
    const boundedX = Math.max(10, Math.min(newX, viewportWidth - 200));
    const boundedY = Math.max(10, Math.min(newY, viewportHeight - 300));

    setPosition({ x: boundedX, y: boundedY });
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
  }, [isDragging, dragOffset]);

  /**
   * TAB NAVIGATION
   * Smooth scrolling and tab switching with visual feedback
   */
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    
    // Smooth scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={navRef}
      className={`fixed z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200/50 transition-all duration-300 ${
        isDragging ? 'shadow-amber-300/50 scale-105' : 'shadow-amber-200/30'
      } ${isCollapsed ? 'w-16' : 'w-56'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with drag handle and collapse button */}
      <div className="flex items-center justify-between p-3 border-b border-amber-200/50 cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-300 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-200 rounded-full"></div>
        </div>
        
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-amber-100 transition-colors"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`nav-tab w-full flex items-center space-x-3 p-3 rounded-xl mb-1 transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-amber-100 text-amber-900 shadow-inner'
                : 'text-amber-700 hover:bg-amber-50 hover:shadow-md'
            }`}
          >
            <span className="text-lg flex-shrink-0">{tab.icon}</span>
            {!isCollapsed && (
              <span className="font-['VT323'] font-medium text-sm truncate">
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Current Tab Indicator */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-t border-amber-200/50">
          <div className="text-xs text-amber-600 font-['VT323'] truncate">
            Active: {tabs.find(t => t.id === activeTab)?.label.replace(/[^a-zA-Z ]/g, '')}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingNav;
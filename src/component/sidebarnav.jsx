import React, { useState } from 'react';

/**
 * SIDEBAR NAVIGATION COMPONENT
 * 
 * Features:
 * - Fixed to left side of screen
 * - Collapses to icon-only view (60px wide)
 * - Expands on hover to show labels (200px wide)
 * - Doesn't overlap content when collapsed
 * - Smooth animations
 */
const SidebarNav = ({ activeTab, onTabChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Available tabs for navigation
  const tabs = [
    { id: 'timer', label: 'Timer', icon: '⏰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'todo', label: 'To Do', icon: '📝' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'whiteboard', label: 'Whiteboard', icon: '🖊️' },
    { id: 'rewards', label: 'Rewards', icon: '⭐' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <div
      className="fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out"
      style={{ width: isExpanded ? '200px' : '60px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Sidebar container */}
      <div className="h-full bg-white/95 backdrop-blur-sm shadow-lg border-r border-amber-200/60 flex flex-col">
        
        {/* Header */}
        <div className="p-3 border-b border-amber-200/50">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-200 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 flex flex-col py-4 space-y-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center rounded-lg transition-all duration-200 ${
                isExpanded ? 'px-4 py-3 justify-start' : 'px-3 py-3 justify-center'
              } ${
                activeTab === tab.id
                  ? 'bg-amber-100 text-amber-900 shadow-inner border border-amber-300'
                  : 'text-amber-700 hover:bg-amber-50 hover:shadow-sm border border-transparent'
              }`}
              title={!isExpanded ? tab.label : ''}
            >
              <span className="text-xl flex-shrink-0">
                {tab.icon}
              </span>
              {isExpanded && (
                <span className="font-['VT323'] text-lg ml-3 whitespace-nowrap font-medium">
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        
      </div>
    </div>
  );
};

export default SidebarNav;
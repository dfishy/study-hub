import React, { useState } from 'react';
import { useCalendar } from '../context/calendarcontext';
import { useTodo } from '../context/todocontext';

/**
 * CALENDAR COMPONENT
 * 
 * Features:
 * - Monthly calendar view with smooth month transitions
 * - Event management with persistent storage
 * - Color-coded events by type/category
 * - Smooth animations for month flipping and selections
 * - Integration with other app features (Goals, To-Do)
 */
const Calendar = () => {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getEventsForDate,
    addEvent,
    deleteEvent,
    toggleEventCompletion
  } = useCalendar();
  const { getTasksForDate } = useTodo();

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('study');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  /**
   * Generate calendar grid for the current month
   */
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Starting day of the week (0 = Sunday)
    const startDay = firstDay.getDay();
    
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  /**
   * Check if a date is today
   */
  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  /**
   * Check if a date is selected
   */
  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  /**
   * Check if a date is in the current month
   */
  const isCurrentMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentMonth.getMonth();
  };

  /**
   * Get event color based on type
   */
  const getEventColor = (type) => {
    const colors = {
      study: 'bg-amber-500',
      assignment: 'bg-blue-500',
      exam: 'bg-red-500',
      personal: 'bg-green-500',
      meeting: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  /**
   * Handle adding a new event
   */
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      addEvent(selectedDate, {
        title: newEventTitle.trim(),
        type: newEventType,
        description: ''
      });
      setNewEventTitle('');
      setIsAddingEvent(false);
    }
  };

  /**
   * Format month and year for display
   */
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  /**
   * Format day for display
   */
  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-8 p-4 bg-amber-100 rounded-2xl shadow-lg">
        <button
          onClick={goToPreviousMonth}
          className="p-3 rounded-xl bg-white text-amber-700 hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-md font-['VT323'] text-lg"
        >
          ◀ Prev
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-['VT323'] text-amber-900 mb-2">
            {formatMonthYear(currentMonth)}
          </h2>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-['VT323'] text-sm"
          >
            Today
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-3 rounded-xl bg-white text-amber-700 hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-md font-['VT323'] text-lg"
        >
          Next ▶
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-amber-200 border-b border-amber-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-['VT323'] text-amber-900 text-lg font-bold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`min-h-24 p-2 border border-amber-100 transition-all duration-300 cursor-pointer
                ${!date ? 'bg-gray-50' : ''}
                ${date && isCurrentMonth(date) ? 'bg-white hover:bg-amber-50' : 'bg-amber-50'}
                
                /* TODAY - Distinct blue background with strong border */
                ${date && isToday(date) && !isSelected(date) ? 'bg-blue-100 border-2 border-blue-400 shadow-md pulse-gentle' : ''}
                
                /* SELECTED - Amber background */
                ${date && isSelected(date) && !isToday(date) ? 'bg-amber-100 border-2 border-amber-500 shadow-md' : ''}
                
                /* BOTH TODAY AND SELECTED - Combined styling */
                ${date && isToday(date) && isSelected(date) ? 'bg-blue-200 border-2 border-blue-600 shadow-lg pulse-gentle' : ''}
                
                ${!date || !isCurrentMonth(date) ? 'opacity-50' : ''}
                transform hover:scale-105`}
              onClick={() => date && setSelectedDate(date)}
            >
              {date && (
                <>
                  <div className={`text-right font-['VT323'] text-lg mb-1
                    /* TODAY - Bold blue text */
                    ${isToday(date) && !isSelected(date) ? 'text-blue-800 font-bold text-xl' : ''}
                    
                    /* SELECTED - Bold amber text */
                    ${isSelected(date) && !isToday(date) ? 'text-amber-900 font-bold' : ''}
                    
                    /* BOTH TODAY AND SELECTED - Very bold blue text */
                    ${isToday(date) && isSelected(date) ? 'text-blue-900 font-bold text-xl' : ''}
                    
                    /* NORMAL DAY - Standard amber */
                    ${!isToday(date) && !isSelected(date) ? 'text-amber-800' : ''}`}>
                    {date.getDate()}
                    
                    {/* Today indicator dot */}
                    {isToday(date) && (
                      <div className="inline-block w-1 h-1 bg-blue-600 rounded-full ml-1"></div>
                    )}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="space-y-1">
                    {getEventsForDate(date).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded text-white truncate ${getEventColor(event.type)} ${
                          isToday(date) ? 'shadow-sm' : ''
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {getEventsForDate(date).length > 2 && (
                      <div className={`text-xs text-center ${
                        isToday(date) ? 'text-blue-700' : 'text-amber-600'
                      }`}>
                        +{getEventsForDate(date).length - 2} more
                      </div>
                    )}
                  </div>
                  {/* To-Do count indicator */}
                    {getTasksForDate(date).length > 0 && (
                      <div className="text-xs text-amber-700 font-['VT323'] mt-1 text-center">
                        📌 {getTasksForDate(date).length} task{getTasksForDate(date).length > 1 ? 's' : ''}
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Events Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-['VT323'] text-amber-900">
              {formatDay(selectedDate)}
            </h3>
            {isToday(selectedDate) && (
              <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full font-['VT323'] animate-pulse">
                📅 Today
              </span>
            )}
          </div>
          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-['VT323']"
          >
            {isAddingEvent ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {/* Add Event Form */}
        {isAddingEvent && (
          <form onSubmit={handleAddEvent} className="mb-6 p-4 bg-amber-50 rounded-xl transition-all duration-300 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title..."
                className="col-span-2 p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-['VT323']"
                autoFocus
              />
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
                className="p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-['VT323']"
              >
                <option value="study">📚 Study</option>
                <option value="assignment">📝 Assignment</option>
                <option value="exam">🎯 Exam</option>
                <option value="personal">👤 Personal</option>
                <option value="meeting">👥 Meeting</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-['VT323'] text-lg"
            >
              Add Event
            </button>
          </form>
        )}

        {/* Events List */}
        <div className="space-y-3">
          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8 text-amber-600 font-['VT323']">
              No events scheduled for this day
            </div>
          ) : (
            getEventsForDate(selectedDate).map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border-l-4 transition-all duration-300 transform hover:scale-105 ${
                  event.completed ? 'opacity-60 bg-gray-100' : 'bg-white shadow-md'
                } ${
                  event.type === 'study' ? 'border-l-amber-500' :
                  event.type === 'assignment' ? 'border-l-blue-500' :
                  event.type === 'exam' ? 'border-l-red-500' :
                  event.type === 'personal' ? 'border-l-green-500' :
                  'border-l-purple-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={event.completed}
                      onChange={() => toggleEventCompletion(selectedDate, event.id)}
                      className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                    />
                    <span className={`font-['VT323'] ${event.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {event.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteEvent(selectedDate, event.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
                {event.description && (
                  <p className="mt-2 text-sm text-gray-600 font-['VT323']">
                    {event.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
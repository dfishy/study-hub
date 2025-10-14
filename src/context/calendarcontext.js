import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CALENDAR CONTEXT
 * Provides global calendar state management so events persist
 * across different tabs and sessions
 */
const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('studyHubEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('studyHubEvents', JSON.stringify(events));
  }, [events]);

  /**
   * Add a new event to the calendar
   */
  const addEvent = (date, event) => {
    const dateKey = date.toDateString();
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      date: dateKey,
      completed: false
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));

    return newEvent.id;
  };

  /**
   * Update an existing event
   */
  const updateEvent = (date, eventId, updates) => {
    const dateKey = date.toDateString();
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      ) || []
    }));
  };

  /**
   * Delete an event
   */
  const deleteEvent = (date, eventId) => {
    const dateKey = date.toDateString();
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(event => event.id !== eventId) || []
    }));
  };

  /**
   * Toggle event completion status
   */
  const toggleEventCompletion = (date, eventId) => {
    const dateKey = date.toDateString();
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map(event => 
        event.id === eventId ? { ...event, completed: !event.completed } : event
      ) || []
    }));
  };

  /**
   * Get events for a specific date
   */
  const getEventsForDate = (date) => {
    return events[date.toDateString()] || [];
  };

  /**
   * Navigate to previous month
   */
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  /**
   * Navigate to next month
   */
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  /**
   * Navigate to today
   */
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const value = {
    events,
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventCompletion,
    getEventsForDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
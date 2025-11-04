import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCalendar } from './calendarcontext'; 

const TodoContext = createContext();

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within a TodoProvider');
  return context;
};

export const TodoProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
//   const { addEvent, deleteEvent, toggleEventCompletion } = useCalendar();

  const calendar = useCalendar();
  const addEvent = calendar?.addEvent ?? (() => {});
  const deleteEvent = calendar?.deleteEvent ?? (() => {});
  const toggleEventCompletion = calendar?.toggleEventCompletion ?? (() => {});

  // 🔹 Load and persist tasks in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studyHubTasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('studyHubTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title, category = 'General', dueDate = null) => {
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate
        ? (() => {
            const [y, m, d] = dueDate.split('-').map(Number);
            return new Date(y, m - 1, d).toLocaleDateString('en-CA'); // "YYYY-MM-DD" local
            })()
        : null,
      linkedEventId: null,
    };

    setTasks(prev => [...prev, newTask]);

    // if a due date exists, mirror it in calendar
   if (dueDate) {
  // Convert date string "YYYY-MM-DD" to a true local Date
  const [y, m, d] = dueDate.split('-').map(Number);
  const localDate = new Date(y, m - 1, d);

  const eventId = addEvent(localDate, {
    title,
    type: 'assignment',
    description: 'From To-Do',
  });
  newTask.linkedEventId = eventId;
}
  };

    const toggleTaskCompletion = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find(t => t.id === id);
    if (task?.dueDate && task.linkedEventId && toggleEventCompletion) {
      toggleEventCompletion(new Date(task.dueDate), task.linkedEventId);
    }
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task?.dueDate && task.linkedEventId && deleteEvent) {
      deleteEvent(new Date(task.dueDate), task.linkedEventId);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };


    const getTasksForDate = (date) => {
    const target = new Date(date);
    const [ty, tm, td] = [target.getFullYear(), target.getMonth(), target.getDate()];

    return tasks.filter(t => {
        if (!t.dueDate) return false;
        const [y, m, d] = t.dueDate.split('-').map(Number);
        return y === ty && m - 1 === tm && d === td;
    });
    };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const value = {
    tasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    clearCompleted,
    getTasksForDate,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
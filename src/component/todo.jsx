import React, { useState } from 'react';
import { useTodo } from '../context/todocontext';

const Todo = () => {
  const { tasks, addTask, deleteTask, toggleTaskCompletion, clearCompleted } = useTodo();
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(newTask, category, dueDate || null);
    setNewTask('');
    setDueDate('');
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-['VT323'] text-amber-900 mb-6 text-center">📝 TO-DO LIST</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 mb-6 bg-amber-100 p-4 rounded-xl shadow-lg">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-3 border border-amber-300 rounded-lg font-['VT323'] focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-amber-300 rounded-lg font-['VT323'] focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="General">General</option>
          <option value="Study">Study</option>
          <option value="Assignment">Assignment</option>
          <option value="Personal">Personal</option>
        </select>

        <div className="relative">
        <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="appearance-none p-3 pl-10 border border-amber-300 rounded-lg font-['VT323']
                    bg-white text-amber-800 placeholder:text-amber-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400
                    transition hover:bg-amber-50 w-full"
        />
        <span className="absolute left-3 top-3.5 text-amber-500 pointer-events-none text-xl">
            📅
        </span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-['VT323'] text-xl hover:bg-green-600 transition"
        >
          ADD
        </button>
      </form>

      {/* Active Tasks */}
      <section className="mb-6">
        <h2 className="text-2xl font-['VT323'] text-amber-900 mb-3">Active Tasks</h2>
        {activeTasks.length === 0 ? (
          <p className="text-amber-600 text-center font-['VT323']">No active tasks 🎉</p>
        ) : (
          <div className="space-y-3">
            {activeTasks.map(task => (
              <div key={task.id} className={`p-4 bg-white border-l-4 rounded-lg shadow flex justify-between items-center
    ${new Date(task.dueDate).toDateString() === new Date().toDateString()
      ? 'border-amber-500 ring-2 ring-amber-300 animate-pulse'
      : 'border-amber-400'}`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span className="font-['VT323'] text-lg text-gray-800">{task.title}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-['VT323'] text-green-700">Completed</h2>
            <button
              onClick={clearCompleted}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-['VT323'] hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="p-3 bg-green-50 border-l-4 border-green-400 rounded-lg text-gray-600 line-through font-['VT323']">
                {task.title}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Todo;
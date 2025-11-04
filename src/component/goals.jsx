import React, { useState } from 'react';
import { useTimer } from '../context/timercontext';

const Goals = () => {
  const { goals, addGoal, deleteGoal } = useTimer();
  
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalHours, setNewGoalHours] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalHours || newGoalHours <= 0) {
      alert('Please enter a valid category name and target hours');
      return;
    }

    addGoal(newGoalName, newGoalHours);
    setNewGoalName('');
    setNewGoalHours('');
    setShowForm(false);
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const calculateProgress = (completedMinutes, targetHours) => {
    const completedHours = completedMinutes / 60;
    const percentage = Math.min((completedHours / targetHours) * 100, 100);
    return {
      completedHours: completedHours.toFixed(1),
      percentage: percentage.toFixed(1)
    };
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-['VT323'] text-amber-900">STUDY GOALS</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-['VT323'] text-xl shadow-md transition hover:bg-green-600 hover:scale-105"
          >
            {showForm ? 'CANCEL' : '+ NEW GOAL'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="w-full max-w-4xl bg-amber-100 p-6 rounded-3xl shadow-lg mb-8 border border-amber-300">
          <h2 className="text-2xl font-['VT323'] text-amber-900 mb-4">CREATE NEW GOAL</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="goalName" className="block mb-2 font-['VT323'] font-medium text-amber-900">
                Category Name:
              </label>
              <input
                type="text"
                id="goalName"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="e.g., Math, Physics, Programming"
                className="w-full px-3 py-2 border border-amber-300 rounded-lg text-center font-['VT323'] text-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="w-full sm:w-40">
              <label htmlFor="goalHours" className="block mb-2 font-['VT323'] font-medium text-amber-900">
                Target Hours:
              </label>
              <input
                type="number"
                id="goalHours"
                min="1"
                value={newGoalHours}
                onChange={(e) => setNewGoalHours(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 border border-amber-300 rounded-lg text-center font-['VT323'] text-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              onClick={handleAddGoal}
              className="self-end px-6 py-3 bg-green-500 text-white rounded-xl font-['VT323'] text-xl shadow-md transition hover:bg-green-600 hover:scale-105"
            >
              ADD
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {goals.length === 0 ? (
          <div className="text-center py-12 bg-amber-100 rounded-3xl shadow-lg border border-amber-300">
            <p className="text-2xl font-['VT323'] text-amber-900">No goals yet! Create one to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const { completedHours, percentage } = calculateProgress(goal.completedMinutes, goal.targetHours);
              const progressColor = getProgressColor(parseFloat(percentage));

              return (
                <div
                  key={goal.id}
                  className="bg-amber-100 p-6 rounded-3xl shadow-lg transition-colors duration-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-['VT323'] text-amber-900">{goal.name}</h3>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-['VT323'] text-lg shadow-md transition hover:bg-red-600 hover:scale-105"
                    >
                      DELETE
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-['VT323'] text-xl text-amber-900">
                      {completedHours} / {goal.targetHours} hours
                    </span>
                    <span className="font-['VT323'] text-xl text-amber-900">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-amber-200 rounded-full h-8 overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${progressColor} transition-all duration-500 flex items-center justify-center text-white font-['VT323'] text-lg`}
                      style={{ width: `${percentage}%` }}
                    >
                      {parseFloat(percentage) > 15 && `${percentage}%`}
                    </div>
                  </div>

                  {parseFloat(percentage) >= 100 && (
                    <p className="mt-4 text-green-600 font-['VT323'] text-xl text-center">
                      GOAL COMPLETED! GREAT WORK!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
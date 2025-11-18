import React, { useEffect } from 'react';
import { useTodo } from '../context/todocontext';
import { useTimer } from '../context/timercontext';
import { useBackground } from '../context/backgroundcontext';

const Rewards = () => {
  const { tasks } = useTodo();
  const { goals } = useTimer();
  const { 
    backgrounds, 
    purchasedBackgrounds, 
    activeBackground,
    points, 
    setPoints, 
    purchaseBackground,
    changeBackground 
  } = useBackground();

  // ---- Reward rules ----
  const POINTS_PER_GOAL = 50;
  const POINTS_PER_TASK = 10;

  // ---- Derived stats ----
  const completedTasks = tasks.filter(t => t.completed);
  const totalTasks = tasks.length;

  const completedGoals = goals.filter(
    g => g.completedMinutes >= g.targetHours * 60
  );
  const totalGoals = goals.length;

  const pointsFromGoals = completedGoals.length * POINTS_PER_GOAL;
  const pointsFromTasks = completedTasks.length * POINTS_PER_TASK;

  const calculatedPoints = pointsFromGoals + pointsFromTasks;

  // Sync points with background context
  useEffect(() => {
    setPoints(calculatedPoints);
  }, [calculatedPoints, setPoints]);

  // Progress percentages (for bars)
  const taskProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);
  const goalProgress =
    totalGoals === 0 ? 0 : Math.round((completedGoals.length / totalGoals) * 100);

  const handlePurchase = (backgroundId) => {
    const result = purchaseBackground(backgroundId);
    if (result.success) {
      alert('🎉 ' + result.message);
    } else {
      alert('❌ ' + result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-['VT323'] text-amber-900 mb-6 text-center">
        ⭐ REWARDS
      </h1>

      {/* Point balance card */}
      <div className="mb-8 bg-amber-100 border border-amber-300 rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between">
        <div>
          <p className="font-['VT323'] text-xl text-amber-800">Point Balance</p>
          <p className="font-['VT323'] text-5xl text-amber-900 mt-2">
            {points}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm font-['VT323'] text-amber-700 max-w-xs">
          Earn points by completing study goals and checking off your To-Do tasks.
          Spend them on backgrounds below!
        </div>
      </div>

      {/* Streak placeholder (we'll hook login later) */}
      <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-4 shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-['VT323'] text-xl text-amber-900">Streak</p>
              <p className="font-['VT323'] text-sm text-amber-700">
                Login streak tracking will be added in a future iteration.
              </p>
            </div>
          </div>
          <span className="font-['VT323'] text-sm text-amber-500 italic">
            Coming soon
          </span>
        </div>
      </div>

      {/* Goal completions section */}
      <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-['VT323'] text-xl text-amber-900">
                Goal Completions
              </p>
              <p className="font-['VT323'] text-sm text-amber-700">
                {completedGoals.length}/{totalGoals || 0} goals completed
              </p>
            </div>
          </div>
          <p className="font-['VT323'] text-sm text-amber-700">
            Reward: {POINTS_PER_GOAL} points each
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden shadow-inner mb-2">
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${goalProgress}%` }}
          ></div>
        </div>
        <p className="font-['VT323'] text-xs text-amber-700">
          Progress: {goalProgress}%
        </p>
      </div>

      {/* Task completions section */}
      <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☑️</span>
            <div>
              <p className="font-['VT323'] text-xl text-amber-900">
                Task Completions
              </p>
              <p className="font-['VT323'] text-sm text-amber-700">
                {completedTasks.length}/{totalTasks || 0} tasks completed
              </p>
            </div>
          </div>
          <p className="font-['VT323'] text-sm text-amber-700">
            Reward: {POINTS_PER_TASK} points each
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden shadow-inner mb-2">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
        <p className="font-['VT323'] text-xs text-amber-700">
          Progress: {taskProgress}%
        </p>
      </div>

      {/* Background Shop */}
      <div className="mb-6">
        <h2 className="text-3xl font-['VT323'] text-amber-900 mb-4 text-center">
          🎨 Background Shop
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {backgrounds.map((bg) => {
            const isOwned = purchasedBackgrounds.includes(bg.id);
            const isActive = activeBackground === bg.id;

            return (
              <div 
                key={bg.id}
                className={`bg-white border-2 rounded-2xl p-4 shadow-md transition-all ${
                  isActive ? 'border-amber-500 ring-2 ring-amber-300' : 'border-amber-200'
                }`}
              >
                {/* Preview */}
                <div 
                  className="h-32 rounded-xl mb-3 bg-gray-100"
                  style={{
                    backgroundImage: bg.image ? `url(${bg.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                
                {/* Info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-['VT323'] text-xl text-amber-900">
                    {bg.name}
                  </h3>
                  {isActive && (
                    <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-['VT323']">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                {isOwned ? (
                  <button
                    onClick={() => changeBackground(bg.id)}
                    disabled={isActive}
                    className={`w-full py-2 rounded-xl font-['VT323'] text-sm transition-colors ${
                      isActive 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    {isActive ? '✓ Currently Active' : 'Set as Active'}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(bg.id)}
                    disabled={points < bg.cost}
                    className={`w-full py-2 rounded-xl font-['VT323'] text-sm transition-colors ${
                      points < bg.cost
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {points < bg.cost ? `Need ${bg.cost - points} more points` : `Buy for ${bg.cost} points`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
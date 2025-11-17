import React from 'react';
import { useTodo } from '../context/todocontext';
import { useTimer } from '../context/timercontext';

const Rewards = () => {
  const { tasks } = useTodo();
  const { goals } = useTimer();

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

  const totalPoints = pointsFromGoals + pointsFromTasks;

  // Progress percentages (for bars)
  const taskProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);
  const goalProgress =
    totalGoals === 0 ? 0 : Math.round((completedGoals.length / totalGoals) * 100);

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
            {totalPoints}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm font-['VT323'] text-amber-700 max-w-xs">
          Earn points by completing study goals and checking off your To-Do tasks.
          Streak and redemption features coming soon.
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

      {/* Future Redeem section placeholder */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center font-['VT323'] text-amber-700 text-sm">
        🎵 Background music and visual themes will be unlockable with points in a
        future update. For now, keep completing goals and tasks to build your
        balance!
      </div>
    </div>
  );
};

export default Rewards;
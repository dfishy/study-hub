import Timer from './component/timer';
import SidebarNav from './component/sidebarnav';
import { useState } from 'react';
import Calendar from './component/calendar';
import { TimerProvider } from './context/timercontext';
import { CalendarProvider } from './context/calendarcontext';
import { TodoProvider } from './context/todocontext';
import Todo from './component/todo';
import Goals from './component/goals';
import Whiteboard from './component/whiteboard';
import Rewards from './component/rewards';
import './index.css'
import DatabaseTest from './component/databasetest'

// MUSIC SYSTEM IMPORTS
import { MusicProvider } from './context/musiccontext';
import MusicPlayer from './component/musicplayer';

// Supabase client
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tqmdfchekcshxcufdyke.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWRmY2hla2NzaHhjdWZkeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzUyOTMsImV4cCI6MjA3NDY1MTI5M30.6W9wpLsU6mpikeTTX6KKcW0NKk9T1WiBoVdZKiXF6Mk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'goals':
        return <Goals />;
      case 'todo':
        return <Todo />;
      case 'calendar':
        return <Calendar />;
      case 'whiteboard':
        return <Whiteboard />;
      case 'rewards':
        return <Rewards />;
      default:
        return <Timer />;
    }
  };

  return (
    <MusicProvider>
      <TimerProvider>
        <CalendarProvider>
          <TodoProvider>

            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 font-['VT323'] relative">

              <SidebarNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col items-center justify-center">

                <header className="mb-8 text-center pt-8">
                  <h1 className="text-5xl font-bold text-amber-900 mb-2 font-['VT323'] tracking-wide">STUDY HUB</h1>
                  <p className="text-lg text-amber-700">
                    {activeTab === 'timer' && 'Your all-in-one focus companion.'}
                    {activeTab === 'goals' && 'Set and achieve your study goals.'}
                    {activeTab === 'todo' && 'Organize your tasks and assignments.'}
                    {activeTab === 'calendar' && 'Plan your study schedule.'}
                    {activeTab === 'whiteboard' && 'Visualize your ideas and concepts.'}
                    {activeTab === 'rewards' && 'See how your effort turns into points.'}
                  </p>
                </header>

                <main className="w-full">
                  {renderActiveContent()}
                </main>

                {/* 🎵 MUSIC PLAYER HERE */}
                <MusicPlayer />

                <footer className="mt-12 text-sm text-amber-600">
                  <p>
                    {activeTab === 'timer' && 'More features coming soon! :3'}
                    {activeTab !== 'timer' && 'This feature is under development! 🛠️'}
                  </p>
                  <p className="mt-2">
                    <a
                      href="https://forms.gle/KRTWWmB53xMfJV248"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-700"
                    >
                      Submit Feedback
                    </a>
                  </p>
                </footer>

              </div>
            </div>

          </TodoProvider>
        </CalendarProvider>
      </TimerProvider>
    </MusicProvider>
  );
}

export default App;

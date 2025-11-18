import Timer from './component/timer';
import SidebarNav from './component/sidebarnav';
import { useState } from 'react';
import Calendar from './component/calendar';
import { TimerProvider } from './context/timercontext';
import { CalendarProvider } from './context/calendarcontext';
import { TodoProvider } from './context/todocontext';
import { BackgroundProvider, useBackground } from './context/backgroundcontext';
import Todo from './component/todo';
import Goals from './component/goals';
import Whiteboard from './component/whiteboard';
import Rewards from './component/rewards';
import CreditsModal from './component/creditsmodal';
import './index.css'

/*
// Supabase client
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tqmdfchekcshxcufdyke.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWRmY2hla2NzaHhjdWZkeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzUyOTMsImV4cCI6MjA3NDY1MTI5M30.6W9wpLsU6mpikeTTX6KKcW0NKk9T1WiBoVdZKiXF6Mk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
*/

// MUSIC SYSTEM IMPORTS
import { MusicProvider } from './context/musiccontext';
import MusicPlayer from './component/musicplayer';

// Create a separate component for the main content
function AppContent() {
  const [activeTab, setActiveTab] = useState('timer');
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const { getActiveBackgroundStyle } = useBackground();

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
    <div 
      style={getActiveBackgroundStyle()} 
      className="min-h-screen font-['VT323'] relative transition-all duration-500"
    >
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col items-center justify-center">
          <div className="w-full bg-amber-50/75 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
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
            {/* Credits Modal */}
            <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />

            <footer className="mt-12 text-sm text-amber-600">
              <p>
                {activeTab === 'timer' && 'More features coming soon! :3'}
                {activeTab !== 'timer' && 'This feature is under development! 🛠️'}
              </p>
              <p className="mt-2">
                <a
                  href="https://forms.gle/QKhcpq9cJ3E79uTM8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-700"
                >
                  Submit Feedback
                </a>
                <span>•</span>
                <button
                  onClick={() => setIsCreditsOpen(true)}
                  className="underline hover:text-amber-700"
                >
                  Credits
                </button>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BackgroundProvider>
      <MusicProvider>
        <TimerProvider>
          <CalendarProvider>
            <TodoProvider>
              <AppContent />
            </TodoProvider>
          </CalendarProvider>
        </TimerProvider>
      </MusicProvider>
    </BackgroundProvider>
  );
}

export default App;
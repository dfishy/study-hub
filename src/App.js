import Timer from './component/timer';
import FloatingNav from './component/floatingnav';
import { useState } from 'react';
import Calendar from './component/calendar';
import { TimerProvider } from './context/timercontext';
import { CalendarProvider } from './context/calendarcontext';

// For authentication with supabase
import './index.css'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
// connect to supabase
const supabase = createClient('https://tqmdfchekcshxcufdyke.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWRmY2hla2NzaHhjdWZkeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzUyOTMsImV4cCI6MjA3NDY1MTI5M30.6W9wpLsU6mpikeTTX6KKcW0NKk9T1WiBoVdZKiXF6Mk')


/**
 * STUDY HUB - MAIN APPLICATION COMPONENT
 * 
 * This is the root component that serves as the container for our entire Study Hub application.
 * It handles:
 * - Global layout and styling
 * - Application theming (colors, fonts)
 * - Component composition
 * 
 * Key Design Decisions:
 * - Uses Tailwind CSS for responsive design
 * - Implements a gradient background for visual appeal
 * - Sets up fonts 
 */

function App() {
  // authentication state
  //const [session, setSession] = useState(null)

  // State to track active tab for navigation
  const [activeTab, setActiveTab] = useState('timer');

  // // on component mount, check auth state
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  //   return () => subscription.unsubscribe()
  //   }, [])

  // // if no session, show login
  // if (!session) {
  //   return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  // }



  /**
   * RENDER ACTIVE TAB CONTENT
   * Determines which component to display based on current active tab
   * Currently focuses on Timer as the primary implemented feature
   */
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'goals':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-['VT323'] text-amber-900 mb-4">🎯 Goals</h2>
            <p className="text-amber-700">Set and track your study goals here. Coming soon!</p>
          </div>
        );
      case 'todo':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-['VT323'] text-amber-900 mb-4">📝 To Do</h2>
            <p className="text-amber-700">Manage your tasks and assignments. Coming soon!</p>
          </div>
        );
      case 'calendar':
        return <Calendar />;
      case 'whiteboard':
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-['VT323'] text-amber-900 mb-4">🖊️ Whiteboard</h2>
            <p className="text-amber-700">Brainstorm and visualize ideas. Coming soon!</p>
          </div>
        );
      default:
        return <Timer />;
    }
  };

  return (
    // Wrap entire app with TimerProvider for global timer state management
    <TimerProvider>
      <CalendarProvider>
        {/* The main container with gradient background and font */}
        {/* min-h-screen ensures it takes full viewport height */}
        {/* relative positioning allows floating nav to position absolutely within */}
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 font-['VT323'] relative">
          
          {/* Floating Navigation Component */}
          {/* Provides draggable tab navigation across all Study Hub features */}
          <FloatingNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {/* Main content area with safe padding for floating navigation */}
          <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center justify-center">
            
            {/* Header */}
            {/* Introduction to the web app with dynamic text based on active tab */}
            <header className="mb-8 text-center pt-8">
              <h1 className="text-5xl font-bold text-amber-900 mb-2 font-['VT323'] tracking-wide">STUDY HUB</h1>
              <p className="text-lg text-amber-700">
                {activeTab === 'timer' && 'Your all-in-one focus companion.'}
                {activeTab === 'goals' && 'Set and achieve your study goals.'}
                {activeTab === 'todo' && 'Organize your tasks and assignments.'}
                {activeTab === 'calendar' && 'Plan your study schedule.'}
                {activeTab === 'whiteboard' && 'Visualize your ideas and concepts.'}
              </p>
            </header>
            
            {/* Main content area */}
            {/* Dynamically renders content based on active navigation tab */}
            <main className="w-full max-w-2xl">
              {renderActiveContent()}
            </main>
            
            {/* Footer */}
            {/* Contextual message based on current feature being viewed */}
            <footer className="mt-12 text-sm text-amber-600">
              <p>
                {activeTab === 'timer' && 'More features coming soon! :3'}
                {activeTab !== 'timer' && 'This feature is under development! 🛠️'}
              </p>
              <p className="mt-2">
                <a 
                  href="https://forms.gle/XynurD2b8xXwPSuF6" 
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
      </CalendarProvider>
    </TimerProvider>
  );
}

export default App;
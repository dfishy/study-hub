import Timer from './component/timer';
import SidebarNav from './component/sidebarnav';
import { useState } from 'react';
import Calendar from './component/calendar';
import { TimerProvider } from './context/timercontext';
import { CalendarProvider } from './context/calendarcontext';
import { TodoProvider } from './context/todocontext';
import Todo from './component/todo';
import Goals from './component/goals';
import DatabaseTest from './component/databasetest'

// Supabase client
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tqmdfchekcshxcufdyke.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWRmY2hla2NzaHhjdWZkeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzUyOTMsImV4cCI6MjA3NDY1MTI5M30.6W9wpLsU6mpikeTTX6KKcW0NKk9T1WiBoVdZKiXF6Mk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
        return <Goals />;
      case 'todo':
        return <Todo />;
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
        <TodoProvider> 
        {/* The main container with gradient background and font */}
        {/* min-h-screen ensures it takes full viewport height */}
        {/* relative positioning allows floating nav to position absolutely within */}
        <DatabaseTest />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 font-['VT323'] relative">
          
          {/* Sidebar Navigation Component */}
          <SidebarNav
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
                  href="https://forms.gle/bh2gvfJF2adsb6ao7" 
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
  );
}

export default App;
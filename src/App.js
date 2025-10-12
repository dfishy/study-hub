import Timer from './component/timer';
import FloatingNav from './component/floatingnav';
import { useState } from 'react';

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
  // State to track active tab for navigation
  const [activeTab, setActiveTab] = useState('timer');

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
        return (
          <div className="text-center py-16">
            <h2 className="text-3xl font-['VT323'] text-amber-900 mb-4">📅 Calendar</h2>
            <p className="text-amber-700">View your study schedule. Coming soon!</p>
          </div>
        );
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
    // The main container with gradient background and font
    // min-h-screen ensures it takes full viewport height
    // relative positioning allows floating nav to position absolutely within
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
        </footer>
      </div>
    </div>
  );
}

export default App;
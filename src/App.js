import Timer from './component/timer';

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
  return (
    // The main container with gradient background and font
    // min-h-screen ensures it takes full viewport height
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center p-8 font-['VT323']">
      
      {/* Header */}
      {/* Introduction to the web app */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-amber-900 mb-2 font-['VT323'] tracking-wide">STUDY HUB</h1>
        <p className="text-lg text-amber-700">Your all-in-one focus companion.</p>
      </header>
      
      {/* Main content area */}
      <main className="w-full max-w-2xl">
        <Timer />
      </main>
      
      {/* Footer */}
      <footer className="mt-12 text-sm text-amber-600">
        <p>More features coming soon! :3</p>
      </footer>
    </div>
  );
}

export default App;
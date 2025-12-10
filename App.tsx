import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation.tsx';
import IdeaApp from './IdeaApp.tsx';
import ScenarioApp from './ScenarioApp.tsx';

const App: React.FC = () => {
  const location = useLocation();
  const isScenario = location.pathname === '/scenario';

  return (
    <>
      {/* Global Backgrounds managed here for smooth transitions */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ease-in-out">
        {/* Background for Idea App */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50/50 to-indigo-50/30 transition-opacity duration-700 ${isScenario ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(210_100%_50%/0.08)_0%,transparent_50%)] transition-opacity duration-700 ${isScenario ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_90%_50%/0.06)_0%,transparent_50%)] transition-opacity duration-700 ${isScenario ? 'opacity-0' : 'opacity-100'}`} />

        {/* Background for Scenario App */}
        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 transition-opacity duration-700 ${isScenario ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <Navigation />
      
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<IdeaApp />} />
          <Route path="/scenario" element={<ScenarioApp />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
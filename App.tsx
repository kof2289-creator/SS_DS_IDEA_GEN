import React, { useState } from 'react';
import { Navigation } from './components/Navigation.tsx';
import IdeaApp from './IdeaApp.tsx';
import ScenarioApp from './ScenarioApp.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'idea' | 'scenario'>('idea');

  return (
    <>
      <Navigation activeTab={view} onTabChange={setView} />
      {view === 'idea' ? <IdeaApp /> : <ScenarioApp />}
    </>
  );
};
export default App;
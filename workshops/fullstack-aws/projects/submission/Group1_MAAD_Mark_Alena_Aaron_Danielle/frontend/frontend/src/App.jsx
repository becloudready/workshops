import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ManagerDash from './pages/ManagerDash';
//import TraineeView from './pages/TraineeView';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar activePage={currentView} onNavigate={setCurrentView} />
      
      <main>
        {currentView === 'home' && <Home onNavigate={setCurrentView} />}
        {currentView === 'manager' && <ManagerDash />}
        {currentView === 'trainee' && <TraineeView />}
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoleSelect from './pages/Roleselect';
import ManagerDash from './pages/ManagerDash';
//import TraineeView from './pages/TraineeView';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#1A1517' : '#FDF6F8' }}>
      <Navbar
        activePage={currentView}
        onNavigate={setCurrentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main>
        {currentView === 'home' && (
          <Home onNavigate={setCurrentView} darkMode={darkMode} />
        )}
        {currentView === 'roleselect' && (
          <RoleSelect onNavigate={setCurrentView} darkMode={darkMode} />
        )}
        {currentView === 'manager' && (
          <ManagerDash darkMode={darkMode} />
        )}
        {currentView === 'trainee' && (
          <TraineeView darkMode={darkMode} onNavigate={setCurrentView} />
        )}
      </main>
    </div>
  );
}
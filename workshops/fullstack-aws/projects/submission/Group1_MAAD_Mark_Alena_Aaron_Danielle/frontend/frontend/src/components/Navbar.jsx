import React from 'react';

export default function Navbar({ activePage, onNavigate, darkMode, setDarkMode }) {
  const isDark = darkMode;

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 36px',
      backgroundColor: isDark ? '#1A1517' : '#FDF6F8',
      borderBottom: `1.5px solid ${isDark ? '#45353D' : '#F7D6E0'}`,
      fontFamily: '"Playfair Display", "Georgia", serif',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate('home')} 
        style={{
          fontWeight: 'bold',
          fontSize: '20px',
          color: isDark ? '#FDF6F8' : '#E06287',
          cursor: 'pointer'
        }}
      >
        ✦ NoticeBoardTracker
      </div>

      {/* Navigation and Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'sans-serif' }}>
        
        <button
          onClick={() => onNavigate('home')}
          style={{
            backgroundColor: activePage === 'home' ? '#F28DA8' : 'transparent',
            color: activePage === 'home' ? '#FFFFFF' : isDark ? '#C4B5BC' : '#8A7A83',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Home
        </button>

        <button
          onClick={() => onNavigate('roleselect')}
          style={{
            backgroundColor: activePage === 'roleselect' ? '#F28DA8' : 'transparent',
            color: activePage === 'roleselect' ? '#FFFFFF' : isDark ? '#C4B5BC' : '#8A7A83',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Select Role
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            backgroundColor: isDark ? '#2D1F26' : '#FDE8EE',
            color: isDark ? '#FDF6F8' : '#E06287',
            border: `1px solid ${isDark ? '#5C3848' : '#F7D6E0'}`,
            padding: '8px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

      </div>
    </header>
  );
}
import React from 'react';

export default function Navbar({ activePage, onNavigate }) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#1e293b',
      color: '#ffffff'
    }}>
      {/* Brand Title / Logo */}
      <div
        onClick={() => onNavigate('home')}
        style={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
      >
        Notice Board Tracker
      </div>

      {/* Navigation Controls */}
      <nav style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            backgroundColor: activePage === 'home' ? '#3b82f6' : 'transparent',
            color: '#ffffff',
            border: '1px solid #475569',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('manager')}
          style={{
            backgroundColor: activePage === 'manager' ? '#3b82f6' : 'transparent',
            color: '#ffffff',
            border: '1px solid #475569',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
            Manager View
        </button>
        <button
          onClick={() => onNavigate('trainee')}
          style={{
            backgroundColor: activePage === 'trainee' ? '#3b82f6' : 'transparent',
            color: '#ffffff',
            border: '1px solid #475569',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
            Trainee View (WIP)
        </button>
      </nav>
    </header>
  );
}
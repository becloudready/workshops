import React from 'react';

export default function RoleSelect({ onNavigate, darkMode }) {
  const theme = {
    bg: darkMode ? '#1A1517' : '#FDF6F8',
    cardBg: darkMode ? '#261E22' : '#FFFFFF',
    textPrimary: darkMode ? '#FDF6F8' : '#3A2E35',
    textSecondary: darkMode ? '#C4B5BC' : '#8A7A83',
    border: darkMode ? '#45353D' : '#F7D6E0',
    accentPink: '#F28DA8',
    accentMint: '#C8E6C9'
  };

  return (
    <div style={{
      backgroundColor: theme.bg,
      minHeight: '100vh',
      color: theme.textPrimary,
      fontFamily: '"Playfair Display", "Georgia", serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: theme.cardBg,
        border: `2px solid ${theme.border}`,
        borderRadius: '36px',
        padding: '48px 36px',
        textAlign: 'center',
        boxShadow: '0 16px 36px rgba(242, 141, 168, 0.15)'
      }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#E06287', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
          ✦ PORTAL ACCESS ✦
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: '400', margin: '10px 0 12px 0' }}>
          Choose Your Workspace
        </h1>
        <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: theme.textSecondary, maxWidth: '440px', margin: '0 auto 36px auto' }}>
          Select your role to access customized dashboards and training streams.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          {/* Training Manager Card */}
          <div
            onClick={() => onNavigate('manager')}
            style={{
              padding: '28px',
              borderRadius: '24px',
              border: `1.5px solid ${theme.border}`,
              backgroundColor: darkMode ? '#2F2329' : '#FFF0F5',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(242, 141, 168, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌸</div>
            <h3 style={{ fontSize: '18px', margin: '0 0 6px 0', color: '#E06287' }}>Training Manager</h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '12px', color: theme.textSecondary, margin: 0, lineHeight: '1.5' }}>
              Monitor cohort health, milestone completion, and filter urgent blockers.
            </p>
          </div>

          {/* Trainee Card */}
          <div
            onClick={() => onNavigate('trainee')}
            style={{
              padding: '28px',
              borderRadius: '24px',
              border: `1.5px solid ${darkMode ? '#2E4733' : '#C8E6C9'}`,
              backgroundColor: darkMode ? '#1D2A1F' : '#F1F8F3',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(74, 124, 89, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌿</div>
            <h3 style={{ fontSize: '18px', margin: '0 0 6px 0', color: '#4A7C59' }}>Trainee Portal</h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '12px', color: theme.textSecondary, margin: 0, lineHeight: '1.5' }}>
              View assigned modules, submit daily progress, and report urgent issues.
            </p>
          </div>

        </div>

        <button
          onClick={() => onNavigate('home')}
          style={{
            marginTop: '32px',
            background: 'transparent',
            border: 'none',
            color: theme.textSecondary,
            fontFamily: 'sans-serif',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
}
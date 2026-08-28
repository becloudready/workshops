import React, { useState } from 'react';

export default function Home({ onNavigate, darkMode }) {
  const [activeTab, setActiveTab] = useState('overview');

  const theme = {
    bg: darkMode ? '#1A1517' : '#FDF6F8',
    cardBg: darkMode ? '#261E22' : '#FFFFFF',
    textPrimary: darkMode ? '#FDF6F8' : '#3A2E35',
    textSecondary: darkMode ? '#C4B5BC' : '#8A7A83',
    border: darkMode ? '#45353D' : '#F7D6E0',
    accentPink: '#F28DA8',
    accentMint: '#C8E6C9',
    mintDark: '#4A7C59',
    pillBg: darkMode ? '#32252B' : '#FDE8EE'
  };

  return (
    <div style={{
      backgroundColor: theme.bg,
      minHeight: '100vh',
      color: theme.textPrimary,
      fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
      paddingBottom: '80px',
      transition: 'background-color 0.3s ease'
    }}>

      {/* Hero Header Section */}
      <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 0 24px' }}>
        <div style={{
          backgroundColor: darkMode ? '#2D1F26' : '#FDE8EE',
          borderRadius: '36px',
          padding: '48px 32px',
          border: `2px solid ${theme.border}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center',
          boxShadow: '0 12px 32px rgba(242, 141, 168, 0.12)'
        }}>
          
          <div>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F28DA8',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              <span>♥</span> EDTECH TRAINING & ONBOARDING
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: '400',
              lineHeight: '1.2',
              margin: '0 0 16px 0',
              color: theme.textPrimary
            }}>
              Where structured learning meets <span style={{ fontStyle: 'italic', color: '#E06287' }}>seamless progression.</span>
            </h1>

            <p style={{
              fontFamily: 'sans-serif',
              fontSize: '14px',
              lineHeight: '1.7',
              color: theme.textSecondary,
              maxWidth: '460px',
              margin: '0 0 28px 0'
            }}>
              A centralized hub for cohorts, curriculum plans, and immediate blocker dispatches.
            </p>

            <button
              onClick={() => onNavigate('roleselect')}
              style={{
                padding: '14px 36px',
                borderRadius: '999px',
                backgroundColor: '#F28DA8',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(242, 141, 168, 0.35)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
            >
              Start &rarr;
            </button>
          </div>

          {/* Scalloped Image Frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              border: `6px solid ${darkMode ? '#3D2B34' : '#FFFFFF'}`,
              borderRadius: '40px',
              padding: '10px',
              backgroundColor: darkMode ? '#261E22' : '#FFFFFF',
              boxShadow: '0 16px 30px rgba(0,0,0,0.06)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80"
                alt="Cohort collaboration"
                style={{
                  width: '100%',
                  maxHeight: '260px',
                  borderRadius: '30px',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* KPI Stats Bar */}
      <section style={{ maxWidth: '980px', margin: '36px auto 0 auto', padding: '0 24px' }}>
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '24px',
          border: `1px solid ${theme.border}`,
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#E06287' }}>100%</h2>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Cloud Synced</span>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#4A7C59' }}>3+</h2>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Cohorts</span>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#E06287' }}>Realtime</h2>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Blocker Alert</span>
          </div>
          <div>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#4A7C59' }}>REST API</h2>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>MongoDB Atlas</span>
          </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section style={{ maxWidth: '980px', margin: '64px auto 0 auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '400', margin: '0 0 20px 0' }}>
          ✦ Why NoticeBoardTracker ✦
        </h2>

        {/* Tab Switcher */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: theme.pillBg,
          borderRadius: '999px',
          padding: '4px',
          gap: '4px',
          marginBottom: '32px'
        }}>
          {['overview', 'workflow', 'architecture'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 22px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#F28DA8' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : theme.textSecondary,
                fontFamily: 'sans-serif',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mint Green Card Container */}
        <div style={{
          backgroundColor: darkMode ? '#1F2E22' : '#E8F5E9',
          borderRadius: '28px',
          border: `1px solid ${darkMode ? '#2E4733' : '#C8E6C9'}`,
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '28px',
          textAlign: 'left',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.mintDark, fontFamily: 'sans-serif' }}>
              ✦ STRUCTURED ONBOARDING
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '400', margin: '8px 0 12px 0', color: darkMode ? '#E8F5E9' : '#1B4328' }}>
              Eliminate Scattered Spreadsheets
            </h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '13px', lineHeight: '1.7', color: darkMode ? '#C4D6C7' : '#3E5C46', margin: 0 }}>
              Say goodbye to messy one-to-one chats. Trainees submit daily module progress, and Training Managers receive immediate notifications whenever urgent blockers arise.
            </p>
          </div>

          <div style={{
            backgroundColor: darkMode ? '#261E22' : '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${theme.border}`
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#E06287' }}>✦ Core Capabilities</h4>
            <p style={{ margin: '4px 0', fontSize: '13px', fontFamily: 'sans-serif' }}>• Realtime Blocker Escalation</p>
            <p style={{ margin: '4px 0', fontSize: '13px', fontFamily: 'sans-serif' }}>• Cohort Progression Metrics</p>
            <p style={{ margin: '4px 0', fontSize: '13px', fontFamily: 'sans-serif' }}>• Training Plan Syllabus Tracking</p>
          </div>
        </div>
      </section>

    </div>
  );
}
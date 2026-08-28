import React, { useState, useEffect } from 'react';

export default function ManagerDash({ darkMode }) {
  const [metrics, setMetrics] = useState({
    totalTrainees: 0,
    activeCohorts: 0,
    completedMilestones: 0,
    urgentBlockers: 0
  });
  const [traineeLogs, setTraineeLogs] = useState([]);
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

  const theme = {
    bg: darkMode ? '#1A1517' : '#FDF6F8',
    cardBg: darkMode ? '#261E22' : '#FFFFFF',
    textPrimary: darkMode ? '#FDF6F8' : '#3A2E35',
    textSecondary: darkMode ? '#C4B5BC' : '#8A7A83',
    border: darkMode ? '#45353D' : '#F7D6E0',
    accentPink: '#F28DA8',
    accentMint: '#C8E6C9',
    tableBorder: darkMode ? '#362A30' : '#FDE8EE'
  };

  useEffect(() => {
    setMetrics({
      totalTrainees: 24,
      activeCohorts: 3,
      completedMilestones: 88,
      urgentBlockers: 4
    });
    setTraineeLogs([
      { id: '1', traineeName: 'Alex Smith', cohort: 'Cohort A', module: 'React Hooks', status: 'Blocked', isUrgent: true },
      { id: '2', traineeName: 'Jordan Lee', cohort: 'Cohort B', module: 'Spring Boot APIs', status: 'In Progress', isUrgent: false },
      { id: '3', traineeName: 'Sam Taylor', cohort: 'Cohort A', module: 'MongoDB Atlas', status: 'Completed', isUrgent: false },
      { id: '4', traineeName: 'Morgan Reed', cohort: 'Cohort C', module: 'AWS Deployment', status: 'Blocked', isUrgent: true }
    ]);
  }, []);

  const displayedLogs = filterUrgentOnly 
    ? traineeLogs.filter(log => log.isUrgent) 
    : traineeLogs;

  return (
    <div style={{
      backgroundColor: theme.bg,
      minHeight: '100vh',
      color: theme.textPrimary,
      fontFamily: '"Playfair Display", "Georgia", serif',
      padding: '40px 24px 80px 24px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#E06287', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
            ✦ OPERATIONS & PROGRESSION ✦
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: '400', margin: '8px 0 10px 0' }}>
            Training Manager Overview
          </h1>
          <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
            Real-time cohort monitoring and priority blocker tracking.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '24px', padding: '24px', border: `1.5px solid ${theme.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: theme.textSecondary, fontFamily: 'sans-serif', letterSpacing: '1px' }}>Total Trainees</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: theme.textPrimary }}>{metrics.totalTrainees}</h2>
          </div>

          <div style={{ backgroundColor: theme.cardBg, borderRadius: '24px', padding: '24px', border: `1.5px solid ${theme.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: theme.textSecondary, fontFamily: 'sans-serif', letterSpacing: '1px' }}>Active Cohorts</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: '#4A7C59' }}>{metrics.activeCohorts}</h2>
          </div>

          <div style={{ backgroundColor: theme.cardBg, borderRadius: '24px', padding: '24px', border: `1.5px solid ${theme.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: theme.textSecondary, fontFamily: 'sans-serif', letterSpacing: '1px' }}>Milestones Done</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0', color: '#E06287' }}>{metrics.completedMilestones}</h2>
          </div>

          <div style={{ backgroundColor: '#F28DA8', borderRadius: '24px', padding: '24px', textAlign: 'center', color: '#FFFFFF', boxShadow: '0 8px 20px rgba(242, 141, 168, 0.3)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, fontFamily: 'sans-serif', letterSpacing: '1px' }}>Urgent Blockers</span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 0 0' }}>{metrics.urgentBlockers}</h2>
          </div>

        </div>

        {/* Progression Feed Container */}
        <div style={{ backgroundColor: theme.cardBg, borderRadius: '32px', border: `2px solid ${theme.border}`, padding: '32px', boxShadow: '0 12px 28px rgba(242, 141, 168, 0.08)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 4px 0' }}>✦ Trainee Progression Feed</h3>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary, fontFamily: 'sans-serif' }}>
                Review live status reports submitted by trainees.
              </p>
            </div>

            <button 
              onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: filterUrgentOnly ? '#E06287' : '#F28DA8',
                color: '#FFFFFF',
                fontSize: '12px',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(242, 141, 168, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {filterUrgentOnly ? 'Showing Urgent Only (Reset)' : '✦ Filter Urgent Blockers'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'sans-serif', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.tableBorder}`, color: theme.textSecondary }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Trainee</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Cohort</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Module</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Priority Notice</th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: theme.textPrimary }}>{log.traineeName}</td>
                    <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{log.cohort}</td>
                    <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{log.module}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: log.status === 'Completed' ? (darkMode ? '#1E3022' : '#E8F5E9') : log.status === 'Blocked' ? (darkMode ? '#3B1F26' : '#FDE8EE') : (darkMode ? '#2D2329' : '#FFF0F5'),
                        color: log.status === 'Completed' ? '#4A7C59' : log.status === 'Blocked' ? '#E06287' : theme.textSecondary
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {log.isUrgent ? (
                        <span style={{ backgroundColor: '#E06287', color: '#FFFFFF', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>
                          URGENT
                        </span>
                      ) : (
                        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
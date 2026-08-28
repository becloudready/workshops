import React, { useState, useEffect } from 'react';

export default function ManagerDash() {
  const [metrics, setMetrics] = useState({
    totalTrainees: 0,
    activeCohorts: 0,
    completedMilestones: 0,
    urgentBlockers: 0
  });
  const [traineeLogs, setTraineeLogs] = useState([]);
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

  useEffect(() => {
    setMetrics({
      totalTrainees: 24,
      activeCohorts: 3,
      completedMilestones: 88,
      urgentBlockers: 4
    });
    setTraineeLogs([
      { id: '1', traineeName: 'Alex Smith', group: 'Group A', module: 'React Hooks', status: 'Blocked', isUrgent: true },
      { id: '2', traineeName: 'Jordan Lee', group: 'Group B', module: 'Spring Boot APIs', status: 'In Progress', isUrgent: false },
      { id: '3', traineeName: 'Sam Taylor', group: 'Group A', module: 'MongoDB Atlas', status: 'Completed', isUrgent: false }
    ]);
  }, []);

  const displayedLogs = filterUrgentOnly
    ? traineeLogs.filter(log => log.isUrgent)
    : traineeLogs;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Training Manager Holistic Dashboard</h2>
      
      {/* 4 KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{metrics.totalTrainees}</h3>
          <p>Total Trainees</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{metrics.activeCohorts}</h3>
          <p>Active Cohorts</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{metrics.completedMilestones}</h3>
          <p>Completed Milestones</p>
        </div>
        <div style={{ border: '1px solid #ef4444', padding: '16px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fef2f2' }}>
          <h3 style={{ color: '#dc2626' }}>{metrics.urgentBlockers}</h3>
          <p style={{ color: '#dc2626' }}>Urgent Blockers</p>
        </div>
      </div>

      {/* Group USP Filter Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Trainee Progression Logs</h3>
        <button 
          onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
          style={{
            padding: '8px 16px',
            backgroundColor: filterUrgentOnly ? '#dc2626' : '#f3f4f6',
            color: filterUrgentOnly ? '#fff' : '#111827',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {filterUrgentOnly ? 'Showing Urgent Only (Reset)' : 'Filter Urgent Only'}
        </button>
      </div>

      {/* Trainee Progression Feed */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f9fafb' }}>
            <th style={{ padding: '12px' }}>Trainee</th>
            <th style={{ padding: '12px' }}>Group</th>
            <th style={{ padding: '12px' }}>Module</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Priority</th>
          </tr>
        </thead>
        <tbody>
          {displayedLogs.map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{log.traineeName}</td>
              <td style={{ padding: '12px' }}>{log.group}</td>
              <td style={{ padding: '12px' }}>{log.module}</td>
              <td style={{ padding: '12px' }}>{log.status}</td>
              <td style={{ padding: '12px' }}>
                {log.isUrgent ? (
                  <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    URGENT
                  </span>
                ) : (
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>Standard</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
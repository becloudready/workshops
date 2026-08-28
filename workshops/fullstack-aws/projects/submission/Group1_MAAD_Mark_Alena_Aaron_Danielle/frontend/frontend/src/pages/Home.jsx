import React from 'react';

export default function Home({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '36px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '12px' }}>
          NoticeBoardTracker
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '650px', margin: '0 auto 24px auto' }}>
          The centralized EdTech training and onboarding hub. Choose your role below to manage cohorts, submit module updates, or monitor progression.
        </p>

        {/* Global Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
          
          <div 
            onClick={() => onNavigate('manager')}
            style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.2s' }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1d4ed8' }}>📊 Training Manager</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              View holistic dashboard, track cohort progression, and filter urgent blockers.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('trainee')}
            style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', textAlign: 'left' }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#059669' }}>🎓 Trainee Portal</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Submit daily learning progress, check training plan modules, and report issues.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('onboarding')}
            style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', textAlign: 'left' }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#7c3aed' }}>👥 HR Onboarding</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Onboard new trainees and assign them to active groups or plans.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('planbuilder')}
            style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', textAlign: 'left' }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#d97706' }}>📚 Plan Builder</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Set up curriculum milestones, modules, and track assignments.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Highlights & USP Notice Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>🚨 Urgent Notice Tracking</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Immediate flagging of blocked trainees to streamline manager response times.
          </p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>📂 Group & Cohort Alignment</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Structured communication channels eliminating scattered spreadsheets.
          </p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>⚡ Serverless Cloud Sync</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Real-time persistence with MongoDB Atlas and AWS Lambda deployment.
          </p>
        </div>
      </section>

    </div>
  );
}
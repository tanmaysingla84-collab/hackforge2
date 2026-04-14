import React from 'react';
import { AlertCircle } from 'lucide-react';

const SmartAlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      {alerts.map((alert, idx) => (
        <div key={idx} className="animate-slide-down" style={{
          backgroundColor: 'var(--color-danger-bg)',
          borderLeft: `4px solid var(--color-danger)`,
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="var(--color-danger)" style={{ marginTop: '2px' }} />
          <div>
            <h4 style={{ 
              margin: 0, 
              color: '#B91C1C', 
              fontSize: '15px' 
            }}>
              {alert.courseName}: {alert.type === 'attendance' ? 'Attendance Alert' : 'Score Drop Alert'}
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4b5563' }}>{alert.issue}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: 600, color: '#374151' }}>Action: {alert.recommendedAction}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartAlertBanner;

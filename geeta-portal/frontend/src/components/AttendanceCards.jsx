import React from 'react';

const CircularProgress = ({ val, color }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg height={radius * 2} width={radius * 2} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{val}%</span>
    </div>
  );
};

const AttendanceCards = ({ theoryCourses, labCourses, attendance }) => {
  const allCourses = [
    ...(theoryCourses ?? []),
    ...(labCourses ?? []),
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Subject-wise Attendance</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {allCourses.map((c, i) => {
          const val = attendance?.[c.code];
          const isAlert = typeof val === 'number' ? val < 75 : false;
          const color = isAlert ? 'var(--color-danger)' : 'var(--color-success)';
          
          return (
            <div key={i} className="card" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px',
                border: isAlert ? '1px solid var(--color-danger-bg)' : '1px solid var(--border-color)'
            }}>
              <CircularProgress val={typeof val === 'number' ? val : 0} color={color} />
              <div>
                <h4 style={{ fontSize: '13px', margin: 0, color: 'var(--color-text)' }}>{c.code} {c.name}</h4>
                {isAlert && <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>Action Required</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCards;

import React, { useState } from 'react';
import { ShieldAlert, BellRing, Navigation, FileCheck } from 'lucide-react';

const ControlSwitch = ({ label, description, defaultState, icon: Icon }) => {
  const [active, setActive] = useState(defaultState);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--color-cream)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ padding: '8px', background: 'rgba(245, 166, 35, 0.2)', borderRadius: '8px' }}>
          <Icon size={20} color="var(--color-maroon)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)' }}>{label}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-light)', maxWidth: '200px' }}>{description}</span>
        </div>
      </div>
      
      {/* Custom Mock Toggle Switch */}
      <div 
        onClick={() => setActive(!active)}
        style={{
          width: '44px',
          height: '24px',
          background: active ? 'var(--color-success)' : '#D1D5DB',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          background: 'white',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-sm)',
          transform: active ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  );
};

const ParentControls = () => {
  return (
    <div className="card glass-panel animate-fade-in stagger-3" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert size={20} className="text-maroon" /> 
        Parental Access Protocols
      </h3>
      
      <p className="text-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
        Actively manage automated behaviors and digital approvals for your student.
      </p>

      <ControlSwitch 
        label="Automated Weekly Digest" 
        description="Receive SMS AI reports on Friday evenings." 
        defaultState={true} 
        icon={BellRing} 
      />
      
      <ControlSwitch 
        label="Outing Pass Approval" 
        description="Auto-approve standard weekend out-gates." 
        defaultState={false} 
        icon={Navigation} 
      />
      
      <ControlSwitch 
        label="Extracurricular Deductions" 
        description="Permit attendance deductions for varsity sports." 
        defaultState={true} 
        icon={FileCheck} 
      />

    </div>
  );
};

export default ParentControls;

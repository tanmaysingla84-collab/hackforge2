import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, MessageSquareText } from 'lucide-react';

const Header = ({ studentName, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('role');
    navigate(role === 'parent' ? '/login/parent' : '/login/student');
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Real Logo */}
        <img src="/geeta_logo.png" alt="Geeta University Logo" width="40" height="40" style={{ objectFit: 'contain' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: 'var(--color-maroon)', lineHeight: 1.2 }}>Geeta University</h1>
          <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>Parent-Student Portal</span>
        </div>
      </div>

      {role && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate(role === 'parent' ? '/dashboard/parent' : '/dashboard/student')} className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <LayoutDashboard size={16} /> Dashboard
            </button>
            {role === 'parent' && (
              <button onClick={() => navigate('/messages')} className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border-color)' }}>
                <MessageSquareText size={16} /> Messages
              </button>
            )}
          </nav>

          <div style={{ textAlign: 'right' }}>
            {studentName && <div style={{ fontWeight: 600, fontSize: '14px' }}>{studentName}</div>}
            <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
              {role === 'parent' ? 'Parent View' : 'Student View'}
            </div>
          </div>
          <button onClick={handleLogout} className="btn" style={{ 
            background: '#f8fafc', 
            border: '1px solid var(--border-color)',
            color: 'var(--color-danger)'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

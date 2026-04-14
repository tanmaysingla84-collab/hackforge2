import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-cream)' }}>
      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="animate-slide-down" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/geeta_logo.png" alt="Geeta University Logo" width="80" height="80" style={{ objectFit: 'contain', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '36px', color: 'var(--color-maroon)', marginBottom: '8px' }}>Geeta University Hub</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            A unified connectivity platform for students and parents. Please select your portal to continue.
          </p>
        </div>

        <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', width: '100%', maxWidth: '800px' }}>
          
          {/* Parent Card */}
          <div 
            className="card" 
            style={{ cursor: 'pointer', borderTop: '4px solid var(--color-maroon)', display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigate('/login/parent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-lg)' }}>
                <Users size={32} color="var(--color-maroon)" />
              </div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>Parent Portal</h2>
            </div>
            <p className="text-muted" style={{ flex: 1 }}>Access AI-driven academic insights, track attendance milestones, and communicate directly with university faculty.</p>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-maroon)', fontWeight: 600, marginTop: '24px', gap: '8px' }}>
              Access Dashboard <ArrowRight size={18} />
            </div>
          </div>

          {/* Student Card */}
          <div 
            className="card" 
            style={{ cursor: 'pointer', borderTop: '4px solid var(--color-gold)', display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigate('/login/student')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-lg)' }}>
                <User size={32} color="#92400E" />
              </div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>Student Portal</h2>
            </div>
            <p className="text-muted" style={{ flex: 1 }}>Review your grades, track real-time attendance, and manage your weekly schedules cleanly and efficiently.</p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#92400E', fontWeight: 600, marginTop: '24px', gap: '8px' }}>
              View Records <ArrowRight size={18} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

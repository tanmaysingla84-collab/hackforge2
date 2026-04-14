import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LoginParent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parents = [
        { username: 'parent1', password: 'GU@parent1', studentId: '2210001' },
        { username: 'parent2', password: 'GU@parent2', studentId: '2210002' },
        { username: 'parent3', password: 'GU@parent3', studentId: '2210003' },
      ];
      const match = parents.find(p => p.username === username && p.password === password);
      if (match) {
        localStorage.setItem('studentId', match.studentId);
        localStorage.setItem('role', 'parent');
        navigate('/dashboard/parent');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Server error connecting to portal');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-maroon" style={{ textAlign: 'center', marginBottom: '8px' }}>Parent Portal Login</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
            Enter your parent credentials to access your ward's academic dashboard.
          </p>
          
          {error && (
            <div style={{ padding: '10px', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Parent ID</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. parent1" />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span className="text-muted">Student logging in? </span>
            <button onClick={() => navigate('/login/student')} className="btn" style={{ padding: '6px 16px', background: 'transparent', color: 'var(--color-maroon)', border: '1px solid var(--color-maroon)' }}>
              Switch to Student Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginParent;

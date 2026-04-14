import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiClient } from '../api/client';

const LoginFaculty = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connect specifically to the custom Faculty route over inside backend
      const match = await apiClient.facultyLogin(username, password);
      
      if (match) {
        localStorage.setItem('facultyName', match.name);
        localStorage.setItem('role', 'faculty');
        navigate('/dashboard/faculty');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or server unavailable');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header role="faculty" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-success" style={{ textAlign: 'center', marginBottom: '8px', color: '#10B981' }}>Faculty Secure Gateway</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
            Enter your Authorized Educator ID to oversee class metrics and student progress.
          </p>
          
          {error && (
            <div style={{ padding: '10px', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Educator ID (Username)</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. alokverma" />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Passcode</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ background: '#10B981', borderColor: '#10B981' }}>
              {loading ? 'Authenticating...' : 'Access Terminal'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span className="text-muted">Return to general portal selection? </span>
            <button onClick={() => navigate('/')} className="btn" style={{ padding: '6px 16px', background: 'transparent', color: '#10B981', border: '1px solid #10B981' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFaculty;

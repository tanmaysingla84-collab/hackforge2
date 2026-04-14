import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LoginStudent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const students = [
        { username: '2210001', password: 'GU@2210001', studentId: '2210001' },
        { username: '2210002', password: 'GU@2210002', studentId: '2210002' },
        { username: '2210003', password: 'GU@2210003', studentId: '2210003' },
      ];
      const match = students.find(s => s.username === username && s.password === password);
      if (match) {
        localStorage.setItem('studentId', match.studentId);
        localStorage.setItem('role', 'student');
        navigate('/dashboard/student');
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
          <h2 className="text-maroon" style={{ textAlign: 'center', marginBottom: '8px' }}>Student Portal Login</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
            Enter your Roll Number to view your academic report.
          </p>
          
          {error && (
            <div style={{ padding: '10px', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Roll Number</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. 2210001" />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-secondary w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'View Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <span className="text-muted">Parent logging in? </span>
            <a href="/login/parent" className="text-maroon" style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>Go to Parent Portal</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;

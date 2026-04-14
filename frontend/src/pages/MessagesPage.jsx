import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Messages from '../components/Messages';

const MessagesPage = () => {
  const navigate = useNavigate();
  const studentId = localStorage.getItem('studentId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!studentId || !role) {
      navigate('/login/parent');
    } else if (role === 'student') {
      navigate('/dashboard/student');
    }
  }, [studentId, role, navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      <Header studentName={undefined} role={role} />
      <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
        <Messages studentId={studentId} role={role} />
      </main>
    </div>
  );
};

export default MessagesPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiClient } from '../api/client';
import { Shield, BookOpen, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [facultyRoster, setFacultyRoster] = useState([]);
  const [studentRoster, setStudentRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  // 'faculty' or 'students'
  const [viewMode, setViewMode] = useState('faculty');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const isMasquerading = localStorage.getItem('adminMasquerade') === 'true';
    
    if (role !== 'admin' || !isMasquerading) {
      navigate('/login/faculty');
      return;
    }
    
    loadGlobalRegistries();
  }, [navigate]);

  const loadGlobalRegistries = async () => {
    try {
      setLoading(true);
      const [fac, studs] = await Promise.all([
        apiClient.getAllFaculty(),
        apiClient.getAllStudents()
      ]);
      // Remove the admin itself from the teacher directory array!
      setFacultyRoster(fac.filter(f => !f.isAdmin));
      setStudentRoster(studs);
    } catch (e) {
      toast.error("Failed to connect to central database");
    } finally {
      setLoading(false);
    }
  };

  // Group generic student roster purely into discrete distinct Class arrays logically
  const classBatches = new Map();
  studentRoster.forEach(s => {
    const bName = `${s.branch} Sem-${s.semester}`;
    if (!classBatches.has(bName)) classBatches.set(bName, []);
    classBatches.get(bName).push(s);
  });

  const masqueradeTeacher = (teacherName) => {
    localStorage.setItem('facultyName', teacherName);
    localStorage.setItem('role', 'faculty');
    navigate('/dashboard/faculty');
  };

  const masqueradeStudent = (studentId) => {
    localStorage.setItem('studentId', studentId);
    localStorage.setItem('role', 'student');
    navigate('/dashboard/student');
  };

  const terminateGodMode = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header role="admin" />
      <Toaster position="top-right" />
      
      <main className="container" style={{ flex: 1, padding: '40px 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#3F3F46', borderRadius: '8px' }}>
               <Shield size={32} color="#FBBF24" />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', color: '#18181B', margin: 0 }}>Super Admin Engine</h1>
              <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Secured Root Access Terminal</p>
            </div>
          </div>
          
          <button className="btn" onClick={terminateGodMode} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>
             Terminate Root Session
          </button>
        </div>

        <div className="card" style={{ padding: '16px', background: 'white' }}>
           <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
              <button 
                onClick={() => setViewMode('faculty')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s', background: viewMode === 'faculty' ? '#EFF6FF' : 'transparent', color: viewMode === 'faculty' ? '#2563EB' : 'var(--color-text-light)'
                }}
              >
                <BookOpen size={18} /> Faculty Impersonation Directory
              </button>
              <button 
                onClick={() => setViewMode('students')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s', background: viewMode === 'students' ? '#FFF7ED' : 'transparent', color: viewMode === 'students' ? '#EA580C' : 'var(--color-text-light)'
                }}
              >
                <Users size={18} /> Global Student Base
              </button>
           </div>
           
           <div style={{ paddingTop: '24px' }}>
              {viewMode === 'faculty' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '16px', color: '#1E40AF' }}>Authenticate via Teacher Token</h3>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                      {facultyRoster.map(f => (
                         <button 
                           key={f.username}
                           onClick={() => masqueradeTeacher(f.name)}
                           className="glass-panel"
                           style={{ textAlign: 'left', padding: '20px', borderRadius: '12px', border: '1px solid #BFDBFE', background: 'white', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                           onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                           onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                         >
                            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1E3A8A' }}>{f.name}</span>
                            <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>Access Node: {f.username}</span>
                         </button>
                      ))}
                   </div>
                </div>
              )}

              {viewMode === 'students' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '24px', color: '#9A3412' }}>Hierarchy: Classes</h3>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {Array.from(classBatches.keys()).map(batchName => {
                        const members = classBatches.get(batchName);
                        return (
                          <div key={batchName} style={{ borderLeft: '4px solid #F97316', paddingLeft: '16px' }}>
                             <h4 style={{ fontSize: '18px', color: '#431407', marginBottom: '16px' }}>{batchName}</h4>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                {members.map(s => (
                                   <button 
                                     key={s.id}
                                     onClick={() => masqueradeStudent(s.id)}
                                     className="glass-panel"
                                     style={{ textAlign: 'left', padding: '16px', borderRadius: '8px', border: '1px solid #FFEDD5', background: 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '4px' }}
                                     onMouseEnter={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                     onMouseLeave={e => { e.currentTarget.style.borderColor = '#FFEDD5'; e.currentTarget.style.boxShadow = 'none'; }}
                                   >
                                     <span style={{ fontWeight: 600, fontSize: '15px', color: '#9A3412' }}>{s.name}</span>
                                     <span style={{ fontSize: '12px', color: '#FB923C' }}>ID: {s.rollNo}</span>
                                   </button>
                                ))}
                             </div>
                          </div>
                        )
                      })}
                   </div>
                </div>
              )}
           </div>
        </div>
        
      </main>
    </div>
  );
};

export default AdminDashboard;

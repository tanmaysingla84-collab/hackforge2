import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiClient } from '../api/client';
import { Users, User, Save, RefreshCw, Send, MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [facultyName, setFacultyName] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // View modes: 'aggregate' or 'specific'
  const [viewMode, setViewMode] = useState('aggregate');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Editable forms logic state matrix
  const [editedMarks, setEditedMarks] = useState({});
  const [editedAttendance, setEditedAttendance] = useState({});
  const [directMessage, setDirectMessage] = useState({});
  const [messageTarget, setMessageTarget] = useState({});
  const [saving, setSaving] = useState(false);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const fName = localStorage.getItem('facultyName');
    
    if (role !== 'faculty' || !fName) {
      navigate('/login/faculty');
      return;
    }
    
    setFacultyName(fName);
    loadGlobalRoster();
  }, [navigate]);

  const loadGlobalRoster = async () => {
    try {
      setLoading(true);
      const roster = await apiClient.getAllStudents();
      setStudents(roster);
      if(roster.length > 0) setSelectedStudentId(roster[0].id);
    } catch (err) {
      toast.error('Failed to connect to active student database.');
    } finally {
      setLoading(false);
    }
  };

  // Identify exactly which Subject Codes this specific professor has absolute teaching rights over
  const getAuthorizedCourses = () => {
    if (students.length === 0) return [];
    // We sniff the first student's curriculum to map out all courses, then simply filter for our teacher!
    return students[0].theoryCourses.filter(c => c.teacherName === facultyName);
  };

  const handleMarksChange = (courseCode, field, value) => {
    setEditedMarks(prev => ({
      ...prev,
      [courseCode]: {
        ...(prev[courseCode] || {}),
        [field]: Number(value)
      }
    }));
  };

  const handleAttendanceChange = (courseCode, value) => {
    setEditedAttendance(prev => ({
      ...prev,
      [courseCode]: Number(value)
    }));
  };

  const submitTargetEdits = async (courseCode) => {
    setSaving(true);
    try {
      if (editedMarks[courseCode]) {
        await apiClient.updateMarks(selectedStudentId, courseCode, editedMarks[courseCode]);
      }
      if (editedAttendance[courseCode]) {
        await apiClient.updateAttendance(selectedStudentId, courseCode, editedAttendance[courseCode]);
      }
      toast.success(`Successfully saved overrides for ${courseCode}!`);
      
      // Clears the buffer and forcefully refreshes UI to show Server's confirmed payload!
      setEditedMarks(prev => { const n = {...prev}; delete n[courseCode]; return n; });
      setEditedAttendance(prev => { const n = {...prev}; delete n[courseCode]; return n; });
      await loadGlobalRoster(); 
      
    } catch (err) {
      toast.error('Failed to commit override. Server rejected payload.');
    } finally {
      setSaving(false);
    }
  };

  const sendDirectMessage = async (courseCode) => {
    const text = directMessage[courseCode];
    if (!text || text.trim() === '') return;
    setMessaging(true);
    try {
      const target = messageTarget[courseCode] || 'ALL';
      if (target === 'ALL') {
        const promises = students.map(s => apiClient.sendMessage(s.id, 'teacher', `[${courseCode}] ${text}`));
        await Promise.all(promises);
      } else {
        await apiClient.sendMessage(target, 'teacher', `[${courseCode}] ${text}`);
      }
      toast.success('Successfully deployed message to routing queue!');
      setDirectMessage(prev => ({ ...prev, [courseCode]: '' }));
    } catch (e) {
      toast.error('Failed to route direct message');
    } finally {
      setMessaging(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <RefreshCw className="animate-spin text-maroon" /> Fetching Central Database...
        </div>
      </div>
    );
  }

  const authorizedCourses = getAuthorizedCourses();
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header role="faculty" />
      <Toaster position="top-right" />
      
      <main className="container" style={{ flex: 1, padding: '40px 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: 'var(--color-maroon)', marginBottom: '8px' }}>Faculty Terminal</h1>
            <div style={{ color: 'var(--color-text-light)', fontWeight: 500 }}>
              Authenticated Session: <span style={{ color: '#10B981', fontWeight: 600 }}>{facultyName}</span>
            </div>
            {authorizedCourses.length === 0 ? (
               <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginTop: '4px' }}>No internal courses assigned to you in the database mapping!</div>
            ) : (
               <div style={{ fontSize: '13px', marginTop: '4px', color: 'var(--color-text-light)' }}>
                 Active Routing Authorizations: {authorizedCourses.map(c => c.code).join(', ')}
               </div>
            )}
          </div>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => { localStorage.clear(); navigate('/'); }}
          >
            End Session
          </button>
        </div>

        {authorizedCourses.length > 0 && (
          <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <button 
                onClick={() => setViewMode('aggregate')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s',
                  background: viewMode === 'aggregate' ? '#F0FDF4' : 'transparent',
                  color: viewMode === 'aggregate' ? '#16A34A' : 'var(--color-text-light)'
                }}
              >
                <Users size={18} /> Global Course Analytics
              </button>
              
              <button 
                onClick={() => setViewMode('specific')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s',
                  background: viewMode === 'specific' ? '#EFF6FF' : 'transparent',
                  color: viewMode === 'specific' ? '#2563EB' : 'var(--color-text-light)'
                }}
              >
                <User size={18} /> Targeted Student Editing
              </button>
              
              <button 
                onClick={() => setViewMode('communications')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s',
                  background: viewMode === 'communications' ? '#FAF5FF' : 'transparent',
                  color: viewMode === 'communications' ? '#9333EA' : 'var(--color-text-light)'
                }}
              >
                <MessageSquare size={18} /> Communications Hub
              </button>
            </div>

            <div style={{ paddingTop: '24px' }}>
              {viewMode === 'aggregate' && (
                // --- AGGREGATE VIEW ---
                <div className="animate-fade-in">
                  <h3 style={{ marginBottom: '16px', color: '#16A34A' }}>Class Averages Across Your Subjects</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {authorizedCourses.map(ac => {
                      // Compute Average
                      let totalA1=0, totalA2=0, totalA3=0, totalA4=0, totalMid=0, totalEnd=0, totalAtt=0, attendees=0;
                      
                      students.forEach(s => {
                        const course = s.theoryCourses.find(c => c.code === ac.code);
                        if (course) {
                          totalA1 += course.a1 || 0;
                          totalA2 += course.a2 || 0;
                          totalA3 += course.a3 || 0;
                          totalA4 += course.a4 || 0;
                          totalMid += course.mid || 0;
                          totalEnd += course.end || 0;
                          totalAtt += s.attendance[ac.code] || 0;
                          attendees++;
                        }
                      });

                      return (
                        <div key={ac.code} className="card glass-panel" style={{ borderLeft: '4px solid #16A34A' }}>
                           <h4 style={{ margin: '0 0 16px 0', color: 'var(--color-text)' }}>{ac.code} - {ac.name}</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: '#F8FAFC', padding: '6px', borderRadius: '4px' }}>
                                 <span className="text-muted">A1</span><span style={{ fontWeight: 600 }}>{(totalA1/attendees).toFixed(1)}</span>
                               </div>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: '#F8FAFC', padding: '6px', borderRadius: '4px' }}>
                                 <span className="text-muted">A2</span><span style={{ fontWeight: 600 }}>{(totalA2/attendees).toFixed(1)}</span>
                               </div>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: '#F8FAFC', padding: '6px', borderRadius: '4px' }}>
                                 <span className="text-muted">A3</span><span style={{ fontWeight: 600 }}>{(totalA3/attendees).toFixed(1)}</span>
                               </div>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: '#F8FAFC', padding: '6px', borderRadius: '4px' }}>
                                 <span className="text-muted">A4</span><span style={{ fontWeight: 600 }}>{(totalA4/attendees).toFixed(1)}</span>
                               </div>
                             </div>
                             
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                               <span className="text-muted">Mid Exams (60)</span>
                               <span style={{ fontWeight: 600 }}>{(totalMid/attendees).toFixed(1)}</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                               <span className="text-muted">End Exams (100)</span>
                               <span style={{ fontWeight: 600 }}>{(totalEnd/attendees).toFixed(1)}</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                               <span className="text-muted">Daily Attendance</span>
                               <span style={{ fontWeight: 700, color: '#16A34A' }}>{(totalAtt/attendees).toFixed(1)}%</span>
                             </div>
                           </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {viewMode === 'specific' && (
                // --- TARGETED STUDENT VIEW ---
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, color: '#2563EB' }}>Targeted Edit Terminal</h3>
                    <select 
                      className="input-group"
                      value={selectedStudentId} 
                      onChange={e => setSelectedStudentId(e.target.value)}
                      style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color)', width: '300px' }}
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.rollNo}) - {s.branch}</option>
                      ))}
                    </select>
                  </div>

                  {selectedStudent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {authorizedCourses.map(ac => {
                        const activeCourse = selectedStudent.theoryCourses.find(c => c.code === ac.code);
                        const activeAtt = selectedStudent.attendance[ac.code];
                        
                        // Form Input State Overrides (if typing, show draft, else show canonical DB value)
                        const a1 = editedMarks[ac.code]?.a1 ?? (activeCourse?.a1 || 0);
                        const a2 = editedMarks[ac.code]?.a2 ?? (activeCourse?.a2 || 0);
                        const a3 = editedMarks[ac.code]?.a3 ?? (activeCourse?.a3 || 0);
                        const a4 = editedMarks[ac.code]?.a4 ?? (activeCourse?.a4 || 0);
                        const mid = editedMarks[ac.code]?.mid ?? (activeCourse?.mid || 0);
                        const end = editedMarks[ac.code]?.end ?? (activeCourse?.end || 0);
                        const att = editedAttendance[ac.code] ?? (activeAtt || 0);
                        
                        const isEdited = !!editedMarks[ac.code] || !!editedAttendance[ac.code];

                        return (
                          <div key={ac.code} className="card glass-panel" style={{ borderLeft: '4px solid #2563EB', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ margin: 0, fontSize: '18px' }}>{ac.code} - {ac.name} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-light)', marginLeft: '8px' }}>Editing Data strictly for {selectedStudent.name}</span></h4>
                            </div>

                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                {/* MARKS FORM */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--color-cream)', padding: '16px', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>A1 (Max 25)</label>
                                    <input type="number" value={a1} onChange={e => handleMarksChange(ac.code, 'a1', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>A2 (Max 25)</label>
                                    <input type="number" value={a2} onChange={e => handleMarksChange(ac.code, 'a2', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>A3 (Max 25)</label>
                                    <input type="number" value={a3} onChange={e => handleMarksChange(ac.code, 'a3', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>A4 (Max 25)</label>
                                    <input type="number" value={a4} onChange={e => handleMarksChange(ac.code, 'a4', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>Mid (Max 60)</label>
                                    <input type="number" value={mid} onChange={e => handleMarksChange(ac.code, 'mid', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>End (Max 100)</label>
                                    <input type="number" value={end} onChange={e => handleMarksChange(ac.code, 'end', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                                  </div>
                                </div>

                                {/* ATTENDANCE & COMMIT WRAPPER */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '24px', flex: 1 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>Overall Attendance %</label>
                                    <input type="number" value={att} onChange={e => handleAttendanceChange(ac.code, e.target.value)} style={{ width: '120px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: '#F0F9FF', borderColor: '#BAE6FD', fontWeight: 600 }} />
                                  </div>

                                  <button 
                                    className="btn btn-primary" 
                                    onClick={() => submitTargetEdits(ac.code)}
                                    disabled={!isEdited || saving}
                                    style={{ display: 'flex', gap: '6px', justifyContent: 'center', width: 'auto', alignSelf: 'flex-start', background: isEdited ? '#2563EB' : 'var(--color-text-light)' }}
                                  >
                                    <Save size={16} /> {saving ? 'Writing...' : 'Push to Database'}
                                  </button>
                                </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'communications' && (
                // --- MASS COMMUNICATIONS VIEW ---
                <div className="animate-fade-in">
                  <h3 style={{ marginBottom: '16px', color: '#9333EA' }}>Broadcast Messages to Portals</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {authorizedCourses.map(ac => (
                      <div key={ac.code} className="card glass-panel" style={{ borderLeft: '4px solid #9333EA', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <h4 style={{ margin: '0', color: 'var(--color-text)' }}>{ac.code} - {ac.name}</h4>
                         <p style={{ fontSize: '13px', color: 'var(--color-text-light)', margin: 0 }}>Push a formal message to student accounts enrolled in this specific subject.</p>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#9333EA' }}>Recipient Target</label>
                              <select 
                                className="input-group"
                                value={messageTarget[ac.code] || 'ALL'} 
                                onChange={e => setMessageTarget(prev => ({ ...prev, [ac.code]: e.target.value }))}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D8B4FE', background: '#FAF5FF', fontSize: '14px', margin: 0 }}
                              >
                                <option value="ALL">Everyone (Broadcast to Class)</option>
                                {students.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                                ))}
                              </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                               <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>Message Content</label>
                               <textarea 
                                 value={directMessage[ac.code] || ''}
                                 onChange={e => setDirectMessage(prev => ({ ...prev, [ac.code]: e.target.value }))}
                                 placeholder="e.g., Assignment 3 is due tomorrow!"
                                 style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                               />
                            </div>
                            
                            <button 
                              className="btn" 
                              onClick={() => sendDirectMessage(ac.code)}
                              disabled={messaging || !directMessage[ac.code]}
                              style={{ background: '#9333EA', color: 'white', padding: '10px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, marginTop: '8px' }}
                            >
                              {messaging ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />} 
                              Dispatch Message
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;

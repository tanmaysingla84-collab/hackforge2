import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiClient } from '../api/client';
import { Users, User, Save, RefreshCw, Send, MessageSquare, CalendarCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [facultyName, setFacultyName] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // View modes: 'aggregate' or 'specific' or 'communications'
  const [viewMode, setViewMode] = useState('aggregate');
  
  // Specific view states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Edit logic
  const [editedMarks, setEditedMarks] = useState({});
  const [editedAttendance, setEditedAttendance] = useState({});
  // Daily logic array
  const [dailyDate, setDailyDate] = useState('');
  
  // Messaging
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
    } catch (err) {
      toast.error('Failed to connect to active student database.');
    } finally {
      setLoading(false);
    }
  };

  // Group roster mathematically by semantic Batches & Courses exactly as required
  const getFacultyBatches = () => {
    const batchMap = new Map(); // e.g. "B.Tech CSE Sem-3" -> { name, students, courses }
    students.forEach(s => {
      // The exact requested format:
      const bName = `${s.branch} Sem-${s.semester}`;
      
      const teacherCourses = s.theoryCourses.filter(c => c.teacherName === facultyName);
      if (teacherCourses.length > 0) {
        if (!batchMap.has(bName)) {
           batchMap.set(bName, { name: bName, students: [], courses: new Set() });
        }
        
        batchMap.get(bName).students.push(s);
        teacherCourses.forEach(c => batchMap.get(bName).courses.add(c.code));
      }
    });
    
    // Map Sets back to Arrays for easier rendering
    return Array.from(batchMap.values()).map(b => ({ ...b, courses: Array.from(b.courses) }));
  };

  const handleMarksChange = (courseCode, field, value) => {
    setEditedMarks(prev => ({ ...prev, [courseCode]: { ...(prev[courseCode] || {}), [field]: Number(value) } }));
  };
  const handleAttendanceChange = (courseCode, value) => {
    setEditedAttendance(prev => ({ ...prev, [courseCode]: Number(value) }));
  };

  const markDailyLog = async (courseCode, isPresent) => {
    if(!dailyDate) {
      toast.error("Please explicitly select a date from the calendar picker first!");
      return;
    }
    try {
      await apiClient.updateDailyAttendance(selectedStudentId, courseCode, dailyDate, isPresent);
      toast.success(`Successfully logged daily record for ${dailyDate}!`);
    } catch (e) {
      toast.error("Failed to dump boolean log to backend.");
    }
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
      toast.success(`Successfully saved core parameter overrides for ${courseCode}!`);
      
      setEditedMarks(prev => { const n = {...prev}; delete n[courseCode]; return n; });
      setEditedAttendance(prev => { const n = {...prev}; delete n[courseCode]; return n; });
      await loadGlobalRoster(); 
      
    } catch (err) {
      toast.error('Failed to commit override.');
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
         // Everyone mapping globally
         const promises = students.map(s => apiClient.sendMessage(s.id, 'teacher', `[${courseCode}] ${text}`));
         await Promise.all(promises);
      } else if (target.startsWith('BATCH_')) {
         // Specific Batch mapping
         const batchName = target.replace('BATCH_', '');
         const batchStuds = students.filter(s => `${s.branch} Sem-${s.semester}` === batchName);
         const promises = batchStuds.map(s => apiClient.sendMessage(s.id, 'teacher', `[${courseCode}] ${text}`));
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
           <RefreshCw className="animate-spin text-maroon" /> Mapping Analytics Array...
        </div>
      </div>
    );
  }

  const activeBatches = getFacultyBatches();
  
  // Provide full list of all explicitly authorized subjects across all batches just for summary text
  const universalCodes = new Set();
  activeBatches.forEach(b => b.courses.forEach(c => universalCodes.add(c)));
  const combinedAuthorizedCodes = Array.from(universalCodes);

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
            {combinedAuthorizedCodes.length === 0 ? (
               <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginTop: '4px' }}>No internal courses assigned to you in the database mapping!</div>
            ) : (
               <div style={{ fontSize: '13px', marginTop: '4px', color: 'var(--color-text-light)' }}>
                 Active Data Hooks: {combinedAuthorizedCodes.join(', ')}
               </div>
            )}
          </div>
          
          <button className="btn btn-secondary" onClick={() => { localStorage.clear(); navigate('/'); }}>
            End Session
          </button>
        </div>

        {activeBatches.length > 0 && (
          <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setViewMode('aggregate')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s', background: viewMode === 'aggregate' ? '#F0FDF4' : 'transparent', color: viewMode === 'aggregate' ? '#16A34A' : 'var(--color-text-light)'
                }}
              >
                <Users size={18} /> Global Course Analytics
              </button>
              <button 
                onClick={() => { setViewMode('specific'); setSelectedStudentId(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s', background: viewMode === 'specific' ? '#EFF6FF' : 'transparent', color: viewMode === 'specific' ? '#2563EB' : 'var(--color-text-light)'
                }}
              >
                <User size={18} /> Targeted Roster Editing
              </button>
              <button 
                onClick={() => setViewMode('communications')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', fontWeight: 600, transition: 'all 0.2s', background: viewMode === 'communications' ? '#FAF5FF' : 'transparent', color: viewMode === 'communications' ? '#9333EA' : 'var(--color-text-light)'
                }}
              >
                <MessageSquare size={18} /> Communications Hub
              </button>
            </div>

            <div style={{ paddingTop: '24px' }}>
              
              {viewMode === 'aggregate' && (
                <div className="animate-fade-in">
                  <h3 style={{ marginBottom: '24px', color: '#16A34A' }}>Class-Segmented Analytics</h3>
                  
                  {activeBatches.map(batch => (
                    <div key={batch.name} style={{ marginBottom: '40px' }}>
                      <h4 style={{ fontSize: '20px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', marginBottom: '16px' }}>{batch.name}</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                        {batch.courses.map(courseCode => {
                           let totalA1=0, totalA2=0, totalA3=0, totalA4=0, totalMid=0, totalEnd=0, totalAtt=0, attendees=0;
                           batch.students.forEach(s => {
                             const courseObj = s.theoryCourses.find(c => c.code === courseCode);
                             if (courseObj) {
                               totalA1 += courseObj.a1 || 0;
                               totalA2 += courseObj.a2 || 0;
                               totalA3 += courseObj.a3 || 0;
                               totalA4 += courseObj.a4 || 0;
                               totalMid += courseObj.mid || 0;
                               totalEnd += courseObj.end || 0;
                               totalAtt += s.attendance[courseCode] || 0;
                               attendees++;
                             }
                           });
                           
                           // Bar chart array mappings
                           const chartData = [
                             { name: 'A1', avg: Number((totalA1/attendees).toFixed(1)) },
                             { name: 'A2', avg: Number((totalA2/attendees).toFixed(1)) },
                             { name: 'A3', avg: Number((totalA3/attendees).toFixed(1)) },
                             { name: 'A4', avg: Number((totalA4/attendees).toFixed(1)) },
                             { name: 'Mid', avg: Number((totalMid/attendees).toFixed(1)) },
                             { name: 'End', avg: Number((totalEnd/attendees).toFixed(1)) },
                           ];

                           return (
                             <div key={courseCode} className="card glass-panel" style={{ borderLeft: '4px solid #16A34A', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <h5 style={{ margin: 0, fontSize: '16px' }}>Course: {courseCode}</h5>
                                 <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '100px', fontWeight: 600 }}>{attendees} Verified Attendees</span>
                               </div>
                               
                               <div style={{ height: '220px', width: '100%', border: '1px solid #F1F5F9', borderRadius: '8px', padding: '16px 16px 0 0', background: 'white' }}>
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                      <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                      <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                      <Bar dataKey="avg" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                 </ResponsiveContainer>
                               </div>

                               <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                 <span className="text-muted" style={{ fontSize: '13px', fontWeight: 500 }}>Semester Overall Attendance Matrix</span>
                                 <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>{(totalAtt/attendees).toFixed(1)}%</span>
                               </div>
                             </div>
                           )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {viewMode === 'specific' && (
                <div className="animate-fade-in">
                  
                  {!selectedStudentId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      <h3 style={{ margin: 0, color: '#2563EB' }}>Targeted Edit Terminal</h3>
                      
                      {activeBatches.map(batch => (
                        <div key={batch.name}>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--color-text-light)' }}>{batch.name} Roster</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                            {batch.students.map(s => (
                              <button 
                                key={s.id}
                                onClick={() => setSelectedStudentId(s.id)}
                                className="glass-panel"
                                style={{ 
                                  textAlign: 'left', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '4px' 
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                              >
                                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)' }}>{s.name}</span>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Roll: {s.rollNo}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedStudent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div>
                           <h3 style={{ margin: 0, color: '#2563EB', fontSize: '20px' }}>Editing File: {selectedStudent.name}</h3>
                           <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>{selectedStudent.rollNo} • {selectedStudent.branch} Sem-{selectedStudent.semester}</span>
                        </div>
                        <button onClick={() => setSelectedStudentId('')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                          Cancel / Return to Roster
                        </button>
                      </div>

                      {selectedStudent.theoryCourses.filter(c => c.teacherName === facultyName).map(ac => {
                        const activeAtt = selectedStudent.attendance[ac.code];
                        
                        const a1 = editedMarks[ac.code]?.a1 ?? (ac?.a1 || 0);
                        const a2 = editedMarks[ac.code]?.a2 ?? (ac?.a2 || 0);
                        const a3 = editedMarks[ac.code]?.a3 ?? (ac?.a3 || 0);
                        const a4 = editedMarks[ac.code]?.a4 ?? (ac?.a4 || 0);
                        const mid = editedMarks[ac.code]?.mid ?? (ac?.mid || 0);
                        const end = editedMarks[ac.code]?.end ?? (ac?.end || 0);
                        const att = editedAttendance[ac.code] ?? (activeAtt || 0);
                        
                        const isEdited = !!editedMarks[ac.code] || !!editedAttendance[ac.code];

                        return (
                          <div key={ac.code} className="card glass-panel" style={{ borderLeft: '4px solid #2563EB', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ margin: 0, fontSize: '18px' }}>Course Record: {ac.code}</h4>
                            </div>

                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                {/* MARKS GRID */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--color-cream)', padding: '16px', borderRadius: '8px', flex: 2, minWidth: '300px' }}>
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

                                {/* ATTENDANCE SYSTEM */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '250px' }}>
                                  
                                  {/* OVERALL */}
                                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Master Aggregate Attendance</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <input type="number" value={att} onChange={e => handleAttendanceChange(ac.code, e.target.value)} style={{ width: '90px', padding: '8px', border: '1px solid #93C5FD', borderRadius: '4px', background: '#EFF6FF', fontWeight: 600 }} />
                                      <button className="btn btn-primary" onClick={() => submitTargetEdits(ac.code)} disabled={!isEdited || saving} style={{ flex: 1, display: 'flex', justifyContent: 'center', background: isEdited ? '#2563EB' : 'var(--color-text-light)' }}>
                                        <Save size={16} /> Save Data
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* DAILY OVERRIDE */}
                                  <div style={{ background: '#FFF7ED', padding: '16px', borderRadius: '8px', border: '1px solid #FFEDD5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C2410C', fontWeight: 600, fontSize: '13px' }}>
                                      <CalendarCheck size={16} /> Mark Specifically For Any Day:
                                    </div>
                                    <input type="date" value={dailyDate} onChange={e => setDailyDate(e.target.value)} style={{ padding: '8px', border: '1px solid #FED7AA', borderRadius: '4px', background: 'white' }} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button onClick={() => markDailyLog(ac.code, true)} style={{ flex: 1, background: '#22C55E', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>✓ Present</button>
                                      <button onClick={() => markDailyLog(ac.code, false)} style={{ flex: 1, background: '#EF4444', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>✗ Absent</button>
                                    </div>
                                  </div>

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
                    {combinedAuthorizedCodes.map(code => (
                      <div key={code} className="card glass-panel" style={{ borderLeft: '4px solid #9333EA', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <h4 style={{ margin: '0', color: 'var(--color-text)' }}>Subject Network: {code}</h4>
                         <p style={{ fontSize: '13px', color: 'var(--color-text-light)', margin: 0 }}>Push a formal message to student accounts mapped to this specific channel.</p>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#9333EA' }}>Recipient Target / Scope</label>
                              <select 
                                className="input-group"
                                value={messageTarget[code] || 'ALL'} 
                                onChange={e => setMessageTarget(prev => ({ ...prev, [code]: e.target.value }))}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D8B4FE', background: '#FAF5FF', fontSize: '14px', margin: 0 }}
                              >
                                <option value="ALL">Everyone in {code} (Global Override)</option>
                                {/* Insert Batch specific targeting */}
                                {activeBatches.filter(b => b.courses.includes(code)).map(b => (
                                   <option key={`BATCH_${b.name}`} value={`BATCH_${b.name}`}>Group: {b.name} only</option>
                                ))}
                                {/* Insert specific student targeting */}
                                <optgroup label="Individuals">
                                  {students.filter(s => s.theoryCourses.some(tc => tc.code === code)).map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                               <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)' }}>Message Content</label>
                               <textarea 
                                 value={directMessage[code] || ''}
                                 onChange={e => setDirectMessage(prev => ({ ...prev, [code]: e.target.value }))}
                                 placeholder="e.g., Assignment 3 is uploaded!"
                                 style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                               />
                            </div>
                            
                            <button 
                              className="btn" 
                              onClick={() => sendDirectMessage(code)}
                              disabled={messaging || !directMessage[code]}
                              style={{ background: '#9333EA', color: 'white', padding: '10px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, marginTop: '8px' }}
                            >
                              {messaging ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />} 
                              Dispatch Final Transmission
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

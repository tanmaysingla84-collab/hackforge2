import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Header from '../components/Header';
import SmartAlertBanner from '../components/SmartAlertBanner';
import MarksTable from '../components/MarksTable';
import TrendChart from '../components/TrendChart';
import AttendanceCards from '../components/AttendanceCards';
import WeeklyDigest from '../components/WeeklyDigest';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('studentId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!studentId || role !== 'student') {
      navigate('/login/student');
      return;
    }

    const fetchData = async () => {
      try {
        const studentData = await apiClient.getStudent(studentId);
        setStudent(studentData);
        
        const alertData = await apiClient.getAlerts(studentId);
        setAlerts(alertData);
        if (Array.isArray(alertData) && alertData.length > 0) {
          toast.error(`Smart Alerts: ${alertData.length} issue${alertData.length > 1 ? 's' : ''} found`, { duration: 4500 });
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, role, navigate]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} className="animate-spin text-maroon" />
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Student Data Not Found</h2>
      </div>
    );
  }

  return (
    <div className="student-theme" style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      <Header studentName={student.name} role={role} />
      
      <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
        <SmartAlertBanner alerts={alerts} />

        {/* Student Mini Profile */}
        <div className="card animate-fade-in stagger-1" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', borderTop: '4px solid var(--color-gold)' }}>
          <div>
            <h2 className="text-maroon" style={{ margin: '0 0 8px 0' }}>Welcome back, {student.name}</h2>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-light)', fontSize: '14px' }}>
              <span><strong>Roll No:</strong> {student.rollNo}</span>
              <span><strong>Branch:</strong> {student.branch}</span>
              <span><strong>Sem:</strong> {student.semester}</span>
              <span><strong>Sec:</strong> {student.section}</span>
            </div>
          </div>
          
          <div style={{ 
            background: 'var(--color-gold)', 
            color: 'var(--color-cream)', 
            padding: '12px 24px', 
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Overall Standing
            <div style={{ fontSize: '24px', marginTop: '4px' }}>Good</div>
          </div>
        </div>

        {/* Main Monolithic Column Layout */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
        }}>
          {/* Top Level Dash Layer */}
          <div className="animate-fade-in stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <TrendChart courses={student.theoryCourses} />
            <WeeklyDigest studentId={student.id} studentName={student.name} alertsCount={alerts.length} />
          </div>

          <div className="animate-fade-in stagger-3">
             <AttendanceCards theoryCourses={student.theoryCourses} labCourses={student.labCourses} attendance={student.attendance} studentName={student.name} />
          </div>

          {/* Core Table Layer */}
          <div className="animate-fade-in stagger-4">
             <MarksTable theoryCourses={student.theoryCourses} labCourses={student.labCourses} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

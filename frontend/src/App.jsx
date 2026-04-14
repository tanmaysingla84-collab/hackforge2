import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginParent from './pages/LoginParent';
import LoginStudent from './pages/LoginStudent';
import Home from './pages/Home';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';
import MessagesPage from './pages/MessagesPage';
import LoginFaculty from './pages/LoginFaculty';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/parent" element={<LoginParent />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/login/faculty" element={<LoginFaculty />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

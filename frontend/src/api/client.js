// Cleaned up BASE_URL: Use environment variable if available, otherwise fallback to Render link
const BASE_URL = import.meta.env.VITE_API_URL || 'https://hackforge2.onrender.com/api';

export const apiClient = {
  getStudent: async (id) => {
    const res = await fetch(`${BASE_URL}/student/${id}`); // Change {10} to {id}
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },
  getAlerts: async (id) => {
    const res = await fetch(`${BASE_URL}/student/${id}/alerts`);
    return res.json();
  },

  getInsights: async (studentId) => {
    const res = await fetch(`${BASE_URL}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    return res.json();
  },

  getDigest: async (studentId) => {
    const res = await fetch(`${BASE_URL}/digest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    return res.json();
  },

  getMessages: async (studentId) => {
    const res = await fetch(`${BASE_URL}/messages/${studentId}`);
    return res.json();
  },

  sendMessage: async (studentId, sender, text) => {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, sender, text })
    });
    return res.json();
  },

  // --- FACULTY ROUTES ---
  
  facultyLogin: async (username, password) => {
    const res = await fetch(`${BASE_URL}/faculty/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  getAllFaculty: async () => {
    const res = await fetch(`${BASE_URL}/faculty`);
    if (!res.ok) throw new Error('Failed to fetch faculty directory');
    return res.json();
  },

  getAllStudents: async () => {
    const res = await fetch(`${BASE_URL}/students`);
    if (!res.ok) throw new Error('Failed to fetch class roster');
    return res.json();
  },

  updateMarks: async (studentId, courseCode, payload) => {
    const res = await fetch(`${BASE_URL}/student/${studentId}/marks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseCode, payload })
    });
    if (!res.ok) throw new Error('Failed to update marks');
    return res.json();
  },

  updateAttendance: async (studentId, courseCode, val) => {
    const res = await fetch(`${BASE_URL}/student/${studentId}/attendance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseCode, val })
    });
    if (!res.ok) throw new Error('Failed to update attendance');
    return res.json();
  },

  updateDailyAttendance: async (studentId, courseCode, date, isPresent) => {
    const res = await fetch(`${BASE_URL}/student/${studentId}/attendance/daily`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseCode, date, isPresent })
    });
    if (!res.ok) throw new Error('Failed to dump daily log');
    return res.json();
  }
};
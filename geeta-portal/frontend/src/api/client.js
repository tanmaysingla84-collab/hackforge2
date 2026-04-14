const BASE_URL = import.meta.env.VITE_API_URL || 'https://hackforge-d9f3.onrender.com/api';

export const apiClient = {
  getStudent: async (id) => {
    const res = await fetch(`${BASE_URL}/student/${id}`);
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
  }
};

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import { Send } from 'lucide-react';

const Messages = ({ studentId, role }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiClient.getMessages(studentId);
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    };
    
    fetchMessages(); // initial load
    
    // Poll every 3 seconds to keep portals connected
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [studentId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const sender = role === 'parent' ? 'parent' : 'student';
      const newMsg = await apiClient.sendMessage(studentId, sender, input);
      setMessages([...messages, newMsg]);
      setInput('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', height: '400px', padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0 }}>Direct Messages</h3>
        <p className="text-muted" style={{ margin: 0, fontSize: '13px' }}>Communication thread with Faculty</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fdfbfa' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '40px', fontSize: '14px' }}>
            No messages yet.
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender === (role === 'parent' ? 'parent' : 'student');
            return (
              <div key={msg.id} className="animate-fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginBottom: '4px', marginLeft: '4px', marginRight: '4px' }}>
                  {msg.sender} • {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  backgroundColor: isMe ? 'var(--color-maroon)' : '#E5E7EB',
                  color: isMe ? 'white' : 'var(--color-text)',
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'white' }}>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type a message..." 
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid var(--border-color)',
            borderRadius: '9999px',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button type="submit" disabled={!input.trim()} style={{
            background: input.trim() ? 'var(--color-maroon)' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'background 0.2s'
        }}>
          <Send size={18} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
};

export default Messages;

import React, { useState, useEffect, useRef } from 'react';
import { Phone, BookOpen, UserCircle } from 'lucide-react';

const FacultyDirectory = ({ theoryCourses }) => {
  const [activeCallIdx, setActiveCallIdx] = useState(null);
  const directoryRef = useRef(null);

  // Close the popup if user clicks/touches outside of the active container
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (directoryRef.current && !directoryRef.current.contains(e.target)) {
        setActiveCallIdx(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Hardcoded fallback data in case the Node backend hasn't been rebooted yet
  const fallbackNames = ["Dr. Alok Verma", "Prof. Neeraj Singh", "Dr. Sunita Sharma", "Mrs. Kavita Das", "Dr. R.K. Kapoor", "Dr. Sandeep Yadav"];
  const fallbackPhones = ["+91-98765-43210", "+91-98765-43211", "+91-98765-43212", "+91-98765-43213", "+91-98765-43214", "+91-98765-43215"];

  return (
    <div className="card glass-panel animate-fade-in stagger-2" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={20} className="text-maroon" /> 
        Department Faculty Directory
      </h3>
      <p className="text-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
        Direct contact directory mapping your student's currently active subject professors.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} ref={directoryRef}>
        {theoryCourses.map((c, i) => {
          const tName = c.teacherName || fallbackNames[i % fallbackNames.length];
          const tPhone = c.teacherPhone || fallbackPhones[i % fallbackPhones.length];
          const isOpen = activeCallIdx === i;

          return (
            <div key={i} className="animate-slide-up" style={{ 
              animationDelay: `${i * 0.1}s`, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'var(--color-cream)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-gold)',
              position: 'relative' // Needed to ensure dropdown renders below the physical line correctly
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-maroon)' }}>{c.code} {c.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-light)' }}>
                  <UserCircle size={14} /> {tName}
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '9999px', display: 'flex', gap: '6px', alignItems: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents click from bubbling to outside listener
                    setActiveCallIdx(isOpen ? null : i); // Toggles state
                  }}
                >
                  <Phone size={14} /> Call
                </button>

                {/* Secure Active Phone State View Panel */}
                {isOpen && (
                  <div className="animate-fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-md)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 16px',
                    zIndex: 50,
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    color: 'var(--color-maroon)',
                    fontSize: '14px'
                  }}>
                    {tPhone}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyDirectory;

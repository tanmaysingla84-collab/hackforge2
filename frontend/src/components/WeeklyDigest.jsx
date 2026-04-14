import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { apiClient } from '../api/client';
import { Download, Loader2 } from 'lucide-react';

const WeeklyDigest = ({ studentId, studentName, alertsCount }) => {
  const cardRef = useRef(null);
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getDigest(studentId);
      if (Array.isArray(data.summaryLines)) {
        setDigest(data.summaryLines.join('\n'));
      }
    } catch (err) {
      console.error(err);
      setDigest(`Here is a quick overview of ${studentName}'s week. The system is currently unable to load the AI summary, but please check the dashboard for detailed insight.`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${studentName.replace(' ', '_')}_WeeklyDigest.png`;
    link.click();
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Weekly Snapshot Card</h3>
      <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
        Generate a downloadable weekly summary card for your records or sharing.
      </p>

      {!digest && !loading && (
        <button onClick={handleGenerate} className="btn btn-secondary" style={{ color: 'white' }}>
          Generate Weekly Digest
        </button>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Loader2 size={16} className="animate-spin" color="var(--color-gold)" /> 
          <span className="text-muted">Drafting digest...</span>
        </div>
      )}

      {digest && (
        <div className="animate-fade-in" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Card to be captured */}
          <div 
            ref={cardRef} 
            style={{ 
              width: '100%', 
              maxWidth: '390px',
              margin: '0 auto',
              background: 'var(--color-cream)', 
              borderRadius: '16px', 
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--color-maroon)', padding: '20px', color: 'var(--color-gold)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/gu_logo.png" alt="Logo" width="48" height="48" style={{ objectFit: 'contain', marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '1px' }}>GEETA UNIVERSITY</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Weekly Academic Digest</div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', color: 'var(--color-text)' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>{studentName}</h2>
                <div style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>

              {alertsCount > 0 && (
                <div style={{ background: 'var(--color-warning-bg)', color: '#92400E', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
                  ⚠️ {alertsCount} Attention Item{alertsCount > 1 ? 's' : ''} this week
                </div>
              )}

              <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#374151', fontStyle: 'italic', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                "{digest}"
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#f1ebd9', padding: '12px', textAlign: 'center', fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>
              Official Parent-Student Portal Record
            </div>
          </div>

          <button onClick={downloadPNG} className="btn btn-primary" style={{ marginTop: '16px' }}>
            <Download size={16} /> Download as Image
          </button>
        </div>
      )}
    </div>
  );
};

export default WeeklyDigest;

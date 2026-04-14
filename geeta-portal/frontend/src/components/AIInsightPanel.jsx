import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

const AIInsightPanel = ({ studentId, studentName }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.getInsights(studentId);
      if (data.error) {
        setError(data.details || 'Failed to generate insights.');
      } else {
        setInsights(data);
      }
    } catch (err) {
      setError('An error occurred connecting to the backend AI engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background flair */}
      <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
        <Sparkles size={140} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-maroon)' }}>
            <Sparkles size={20} color="var(--color-gold)" />
            AI Academic Insights
          </h3>
          <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>
            Powered by Claude to provide actionable analysis of {studentName}'s performance.
          </p>
        </div>
        
        {!insights && !loading && (
          <button onClick={generateInsights} className="btn btn-primary" style={{ position: 'relative', zIndex: 10 }}>
            Generate Insights
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '4px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', gap: '16px' }}>
          <Loader2 size={32} className="animate-spin" color="var(--color-maroon)" />
          <p className="text-muted text-sm animate-pulse">Analyzing marks, trends, and attendance...</p>
        </div>
      )}

      {insights && !loading && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {insights.overallSummary && (
            <p style={{ fontStyle: 'italic', color: 'var(--color-text)', borderLeft: '3px solid var(--color-gold)', paddingLeft: '12px' }}>
              "{insights.overallSummary}"
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Strengths */}
            <div style={{ background: 'var(--color-success-bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', marginBottom: '12px' }}>
                <CheckCircle2 size={18} /> Strengths
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#064E3B', fontSize: '14px' }}>
                {insights.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '8px' }}>{s}</li>)}
              </ul>
            </div>

            {/* Weak Areas */}
            <div style={{ background: 'var(--color-warning-bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', marginBottom: '12px' }}>
                <AlertTriangle size={18} /> Areas Needing Attention
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#78350F', fontSize: '14px' }}>
                {insights.weakAreas?.map((w, i) => <li key={i} style={{ marginBottom: '8px' }}>{w}</li>)}
              </ul>
            </div>

            {/* Study Tips */}
            <div style={{ background: 'var(--color-info-bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', marginBottom: '12px' }}>
                <Lightbulb size={18} /> Study Tips
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#1E3A8A', fontSize: '14px' }}>
                {insights.studyTips?.map((t, i) => <li key={i} style={{ marginBottom: '8px' }}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;

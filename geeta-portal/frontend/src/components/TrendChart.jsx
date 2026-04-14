import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ courses }) => {
  // We need to format the data for recharts:
  // Data should be an array of objects where each object represents an assessment (A1, A2, etc)
  const assessments = ['A1', 'A2', 'Mid', 'A3', 'A4', 'End'];
  const chartData = assessments.map((a) => {
    const dataPoint = { name: a };
    courses.forEach((c) => {
      const key = `${c.code} ${c.name}`;
      if (a === 'Mid') dataPoint[key] = typeof c.mid === 'number' ? c.mid : null;
      if (a === 'A1') dataPoint[key] = typeof c.a1 === 'number' ? c.a1 : null;
      if (a === 'A2') dataPoint[key] = typeof c.a2 === 'number' ? c.a2 : null;
      if (a === 'A3') dataPoint[key] = typeof c.a3 === 'number' ? c.a3 : null;
      if (a === 'A4') dataPoint[key] = typeof c.a4 === 'number' ? c.a4 : null;
      if (a === 'End') dataPoint[key] = typeof c.end === 'number' ? c.end : null;
    });
    return dataPoint;
  });

  const colors = ['#8B1A1A', '#F5A623', '#3B82F6', '#10B981', '#8B5CF6'];

  return (
    <div className="card" style={{ marginBottom: '24px', width: '100%', minWidth: 0 }}>
      <h3 style={{ marginBottom: '16px' }}>Performance Trend (Absolute Marks)</h3>
      <div style={{ width: '100%', minHeight: '300px' }}>
        <ResponsiveContainer width="99%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
            labelStyle={{ fontWeight: 'bold', color: 'var(--color-text)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {courses.map((c, i) => (
            <Line 
              key={c.code}
              type="monotone" 
              dataKey={`${c.code} ${c.name}`} 
              stroke={colors[i % colors.length]} 
              strokeWidth={2}
              activeDot={{ r: 6 }} 
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;

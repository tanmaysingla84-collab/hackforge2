import React from 'react';

const MarksTable = ({ theoryCourses, labCourses }) => {

  const getColorClass = (score, max) => {
    if (score === null || score === undefined) return '';
    const percent = (score / max) * 100;
    if (percent >= 80) return 'badge-success';
    if (percent >= 60) return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="card" style={{ overflowX: 'auto', marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Academic Performance</h3>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--color-text-light)' }}>Theory Courses</h4>
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>A1 (25)</th>
              <th>A2 (25)</th>
              <th>Mid-Sem (60)</th>
              <th>A3 (25)</th>
              <th>A4 (25)</th>
              <th>End-Sem (100)</th>
            </tr>
          </thead>
          <tbody>
            {theoryCourses.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{c.code} {c.name}</td>
                <td><span className={`badge ${getColorClass(c.a1, 25)}`}>{c.a1 ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.a2, 25)}`}>{c.a2 ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.mid, 60)}`}>{c.mid ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.a3, 25)}`}>{c.a3 ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.a4, 25)}`}>{c.a4 ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.end, 100)}`}>{c.end ?? '-'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--color-text-light)' }}>Lab Courses</h4>
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Lab A1 (25)</th>
              <th>Lab A2 (25)</th>
            </tr>
          </thead>
          <tbody>
            {labCourses.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{c.code} {c.name}</td>
                <td><span className={`badge ${getColorClass(c.labA1, 25)}`}>{c.labA1 ?? '-'}</span></td>
                <td><span className={`badge ${getColorClass(c.labA2, 25)}`}>{c.labA2 ?? '-'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksTable;

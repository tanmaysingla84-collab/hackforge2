function pct(score, outOf) {
  if (typeof score !== "number") return null;
  return (score / outOf) * 100;
}

function generateAlerts(student) {
  const alerts = [];

  const allCourses = [
    ...(student.theoryCourses ?? []).map((c) => ({ kind: "theory", ...c })),
    ...(student.labCourses ?? []).map((c) => ({ kind: "lab", ...c }))
  ];

  // Attendance alerts (all courses)
  for (const course of allCourses) {
    const att = student.attendance?.[course.code];
    if (typeof att === "number" && att < 75) {
      alerts.push({
        id: `att-${student.id}-${course.code}`,
        type: "attendance",
        courseCode: course.code,
        courseName: `${course.code} ${course.name}`,
        attendance: att,
        issue: `Attendance is below 75% (${att}%).`,
        recommendedAction: "Encourage regular attendance and talk to the subject teacher if needed."
      });
    }
  }

  // Score drop alerts (theory only, skip mid-sem)
  for (const course of student.theoryCourses ?? []) {
    const a1 = pct(course.a1, 25);
    const a2 = pct(course.a2, 25);
    const a3 = pct(course.a3, 25);
    const a4 = pct(course.a4, 25);

    const series = [
      { key: "A1", value: a1 },
      { key: "A2", value: a2 },
      { key: "A3", value: a3 },
      { key: "A4", value: a4 }
    ];

    for (let i = 0; i < series.length - 1; i++) {
      const prev = series[i];
      const next = series[i + 1];
      if (prev.value == null || next.value == null) continue;
      const drop = prev.value - next.value;
      if (drop > 15) {
        alerts.push({
          id: `drop-${student.id}-${course.code}-${prev.key}-${next.key}`,
          type: "score_drop",
          courseCode: course.code,
          courseName: `${course.code} ${course.name}`,
          fromAssessment: prev.key,
          toAssessment: next.key,
          dropPoints: Math.round(drop * 10) / 10,
          issue: `Score dropped by ${Math.round(drop)} percentage points from ${prev.key} to ${next.key}.`,
          recommendedAction: "Review the latest topics together and ask the teacher for specific improvement areas."
        });
      }
    }
  }

  return alerts;
}

module.exports = { generateAlerts };

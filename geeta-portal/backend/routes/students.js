const express = require("express");
const { store } = require("../data/seedData");

const router = express.Router();

router.get("/student/:id", (req, res) => {
  const student = store.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// Admin / Faculty Dashboard hooks: Get overall class view
router.get("/students", (req, res) => {
  res.json(store.students);
});

// Update particular subject marks
router.put("/student/:id/marks", (req, res) => {
  const { courseCode, payload } = req.body;
  const student = store.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const targetCourse = student.theoryCourses.find(c => c.code === courseCode);
  if (targetCourse) {
    // safely assign properties (a1, a2, mid, etc) 
    Object.assign(targetCourse, payload);
    return res.json({ success: true, updatedCourse: targetCourse });
  }
  return res.status(404).json({ message: "Course not found" });
});

// Update particular subject attendance
router.put("/student/:id/attendance", (req, res) => {
  const { courseCode, val } = req.body;
  const student = store.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (student.attendance && typeof student.attendance[courseCode] !== 'undefined') {
    student.attendance[courseCode] = parseInt(val, 10);
    return res.json({ success: true, newAttendance: student.attendance[courseCode] });
  }
  return res.status(404).json({ message: "Course attendance configuration not found" });
});

router.post("/faculty/login", (req, res) => {
  const { username, password } = req.body;
  const match = store.faculty.find(f => f.username === username && f.password === password);
  if (match) return res.json(match);
  return res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;


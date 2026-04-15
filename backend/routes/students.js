const express = require("express");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const router = express.Router();

router.get("/student/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin / Faculty Dashboard hooks: Get overall class view
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update particular subject marks
router.put("/student/:id/marks", async (req, res) => {
  const { courseCode, payload } = req.body;
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const targetCourse = student.theoryCourses.find(c => c.code === courseCode);
    if (targetCourse) {
      Object.assign(targetCourse, payload);
      await student.save();
      return res.json({ success: true, updatedCourse: targetCourse });
    }
    return res.status(404).json({ message: "Course not found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update particular subject attendance
router.put("/student/:id/attendance", async (req, res) => {
  const { courseCode, val } = req.body;
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.attendance && student.attendance.has(courseCode)) {
      student.attendance.set(courseCode, parseInt(val, 10));
      await student.save();
      return res.json({ success: true, newAttendance: student.attendance.get(courseCode) });
    }
    return res.status(404).json({ message: "Course attendance configuration not found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update EXACT Daily configuration boolean
router.put("/student/:id/attendance/daily", async (req, res) => {
  const { courseCode, date, isPresent } = req.body;
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.dailyLogs) student.dailyLogs = new Map();
    if (!student.dailyLogs.has(courseCode)) student.dailyLogs.set(courseCode, new Map());

    student.dailyLogs.get(courseCode).set(date, isPresent);
    await student.save();
    return res.json({ success: true, dailyLogs: Object.fromEntries(student.dailyLogs.get(courseCode)) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/faculty/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const match = await Faculty.findOne({ username, password });
    if (match) return res.json(match);
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find({});
    const safeConfig = faculty.map(f => ({ name: f.name, username: f.username, isAdmin: f.isAdmin }));
    res.json(safeConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

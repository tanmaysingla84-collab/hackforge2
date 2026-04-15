const express = require("express");
const Student = require("../models/Student");
const { generateAlerts } = require("../utils/alertEngine");

const router = express.Router();

router.get("/student/:id/alerts", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(generateAlerts(student));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

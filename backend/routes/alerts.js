const express = require("express");
const { store } = require("../data/seedData");
const { generateAlerts } = require("../utils/alertEngine");

const router = express.Router();

router.get("/student/:id/alerts", (req, res) => {
  const student = store.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(generateAlerts(student));
});

module.exports = router;


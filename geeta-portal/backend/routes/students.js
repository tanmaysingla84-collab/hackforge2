const express = require("express");
const { store } = require("../data/seedData");

const router = express.Router();

router.get("/student/:id", (req, res) => {
  const student = store.students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

module.exports = router;


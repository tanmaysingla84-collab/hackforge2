const express = require("express");
const { z } = require("zod");
const { store } = require("../data/seedData");

const router = express.Router();

router.get("/messages/:studentId", (req, res) => {
  const threads = store.messagesByStudentId[req.params.studentId] ?? [];
  res.json(threads);
});

router.post("/messages", (req, res) => {
  const schema = z.object({
    studentId: z.string().min(1),
    sender: z.enum(["parent", "student", "teacher"]),
    text: z.string().min(1).max(2000)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid request", issues: parsed.error.issues });

  const { studentId, sender, text } = parsed.data;
  if (!store.messagesByStudentId[studentId]) store.messagesByStudentId[studentId] = [];

  const msg = {
    id: `m_${Date.now()}`,
    sender,
    text,
    ts: new Date().toISOString()
  };

  store.messagesByStudentId[studentId].push(msg);
  res.json(msg);
});

module.exports = router;


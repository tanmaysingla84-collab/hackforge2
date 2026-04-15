const express = require("express");
const { z } = require("zod");
const Message = require("../models/Message");

const router = express.Router();

router.get("/messages/:studentId", async (req, res) => {
  try {
    const threads = await Message.find({ studentId: req.params.studentId }).sort({ ts: 1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/messages", async (req, res) => {
  const schema = z.object({
    studentId: z.string().min(1),
    sender: z.enum(["parent", "student", "teacher"]),
    text: z.string().min(1).max(2000)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid request", issues: parsed.error.issues });

  const { studentId, sender, text } = parsed.data;

  const msgData = {
    id: `m_${Date.now()}`,
    studentId,
    sender,
    text,
    ts: new Date().toISOString()
  };

  try {
    const msg = new Message(msgData);
    await msg.save();
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

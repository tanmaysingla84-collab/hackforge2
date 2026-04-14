const express = require("express");
const { z } = require("zod");
const { Anthropic } = require("@anthropic-ai/sdk");
const { store } = require("../data/seedData");

const router = express.Router();

function buildCourseList(student) {
  const theory = (student.theoryCourses ?? [])
    .map(
      (c) =>
        `${c.code} ${c.name}: ${c.a1}, ${c.a2}, ${c.mid}, ${c.a3}, ${c.a4}`
    )
    .join("; ");

  const labs = (student.labCourses ?? [])
    .map((c) => `${c.code} ${c.name}: ${c.labA1}, ${c.labA2}`)
    .join("; ");

  const attendance = Object.entries(student.attendance ?? {})
    .map(([code, pct]) => `${code}: ${pct}%`)
    .join(", ");

  return { theory, labs, attendance };
}

const insightSchema = z.object({
  strengths: z.array(z.string()).length(3),
  weakAreas: z.array(z.string()).length(2),
  studyTips: z.array(z.string()).length(3),
  overallSummary: z.string()
});

function makeAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

router.post("/insights", async (req, res) => {
  const schema = z.object({ studentId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid request", issues: parsed.error.issues });

  const student = store.students.find((s) => s.id === parsed.data.studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const anthropic = makeAnthropic();
  if (!anthropic) {
    // Demo fallback (so UI works without a key)
    return res.json({
      strengths: [
        "Shows steady effort in multiple subjects.",
        "Has strong performance in at least one core course.",
        "Attendance is good in most classes."
      ],
      weakAreas: ["A few subjects need more consistent practice.", "Some classes need better attendance."],
      studyTips: [
        "Set a fixed daily 45-minute study slot.",
        "Ask the teacher for the next 2 topics to focus on.",
        "Track attendance weekly and avoid missing low-attendance classes."
      ],
      overallSummary: "Overall, progress is decent, but improving attendance and consistency will help a lot."
    });
  }

  const { theory, labs, attendance } = buildCourseList(student);

  const prompt = `You are an academic advisor for Geeta University. Analyze this student's data and respond ONLY in this JSON format with no extra text: { strengths: [3 strings], weakAreas: [2 strings], studyTips: [3 strings], overallSummary: string }. Use simple language a parent can understand. Student: ${student.name}, ${student.branch}, Semester ${student.semester}. Theory marks (out of 25 each, Mid-Sem out of 75): ${theory}. Lab marks (out of 25 each): ${labs}. Attendance: ${attendance}.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.content?.[0]?.text ?? "";
    const json = JSON.parse(text);
    const validated = insightSchema.safeParse(json);
    if (!validated.success) {
      return res.status(502).json({ message: "AI returned unexpected format", raw: text });
    }
    res.json(validated.data);
  } catch (e) {
    res.status(500).json({ message: "Failed to generate insights", error: String(e?.message ?? e) });
  }
});

router.post("/digest", async (req, res) => {
  const schema = z.object({ studentId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid request", issues: parsed.error.issues });

  const student = store.students.find((s) => s.id === parsed.data.studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const anthropic = makeAnthropic();
  if (!anthropic) {
    return res.json({
      summaryLines: [
        `${student.name} stayed on track in most subjects this week.`,
        "A couple of areas need attention to avoid last-minute pressure.",
        "Focus on regular revision and keeping attendance above 75%."
      ]
    });
  }

  const { theory, labs, attendance } = buildCourseList(student);

  const prompt = `You are an academic advisor for Geeta University. Write ONLY a JSON object with no extra text: { summaryLines: [3 strings] }. Make each line short and parent-friendly. Student: ${student.name}, ${student.branch}, Semester ${student.semester}. Theory marks: ${theory}. Lab marks: ${labs}. Attendance: ${attendance}.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 250,
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.content?.[0]?.text ?? "";
    const json = JSON.parse(text);
    const validated = z.object({ summaryLines: z.array(z.string()).length(3) }).safeParse(json);
    if (!validated.success) return res.status(502).json({ message: "AI returned unexpected format", raw: text });
    res.json(validated.data);
  } catch (e) {
    res.status(500).json({ message: "Failed to generate digest", error: String(e?.message ?? e) });
  }
});

module.exports = router;


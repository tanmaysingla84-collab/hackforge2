const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/db");

const studentsRouter = require("./routes/students");
const alertsRouter = require("./routes/alerts");
const insightsRouter = require("./routes/insights");
const messagesRouter = require("./routes/messages");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api", studentsRouter);
app.use("/api", alertsRouter);
app.use("/api", insightsRouter);
app.use("/api", messagesRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});

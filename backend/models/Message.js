const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  sender: { type: String, enum: ["parent", "student", "teacher"], required: true },
  courseCode: { type: String },
  fromName: { type: String },
  text: { type: String, required: true },
  ts: { type: String, required: true }
});

module.exports = mongoose.model("Message", messageSchema);

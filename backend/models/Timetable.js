const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotNumber: Number,
  courseCode: { type: String, default: "Free" }
}, { _id: false });

const daySchema = new mongoose.Schema({
  dayOfWeek: String,
  slots: [slotSchema]
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  schedule: [daySchema] 
});

module.exports = mongoose.model("Timetable", timetableSchema);

const mongoose = require("mongoose");

const theoryCourseSchema = new mongoose.Schema({
  code: String,
  name: String,
  a1: Number,
  a2: Number,
  mid: Number,
  a3: Number,
  a4: Number,
  end: Number,
  teacherName: String,
  teacherPhone: String
}, { _id: false });

const labCourseSchema = new mongoose.Schema({
  code: String,
  name: String,
  labA1: Number,
  labA2: Number
}, { _id: false });

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  theoryCourses: [theoryCourseSchema],
  labCourses: [labCourseSchema],
  attendance: {
    type: Map,
    of: Number,
    default: {}
  },
  dailyLogs: {
    type: Map,
    of: {
      type: Map,
      of: Boolean
    },
    default: {}
  }
});

module.exports = mongoose.model("Student", studentSchema);

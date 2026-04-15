const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  branch: { type: String }
});

module.exports = mongoose.model("Parent", parentSchema);

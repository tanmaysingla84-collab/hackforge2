require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../utils/db");
const { seedData } = require("./seedData");

const Faculty = require("../models/Faculty");
const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Message = require("../models/Message");
const Timetable = require("../models/Timetable");

// Helper to generate 14 days of history
function generateMockAttendanceLogs(timetable, student) {
  const logs = [];
  const today = new Date();
  
  // Go back 14 days
  for(let i = 14; i >= 0; i--) {
     const d = new Date();
     d.setDate(today.getDate() - i);
     
     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     const dayName = days[d.getDay()];
     
     const daySchedule = timetable.schedule.find(s => s.dayOfWeek === dayName);
     if (daySchedule) {
       for(let slot of daySchedule.slots) {
         if (slot.courseCode === "Free") continue;
         
         const formattedDate = d.toISOString().split('T')[0];
         
         // Grab old percentage if it exists, otherwise assume 80% passing
         const targetPercentage = student.attendance ? (student.attendance[slot.courseCode] || 80) : 80;
         const isPresent = Math.random() * 100 < targetPercentage;
         
         logs.push({
           date: formattedDate,
           slotNumber: slot.slotNumber,
           courseCode: slot.courseCode,
           status: isPresent ? 'Present' : 'Absent'
         });
       }
     }
  }
  return logs;
}

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log("Clearing existing data...");
    await Faculty.deleteMany({});
    await Parent.deleteMany({});
    await Student.deleteMany({});
    await Message.deleteMany({});
    await Timetable.deleteMany({});

    console.log("Seeding Timetable...");
    const sampleTimetable = new Timetable({
      branch: "B.Tech CSE",
      semester: 3,
      schedule: [
        { dayOfWeek: "Monday", slots: [
            {slotNumber:1, courseCode: "CS201"}, {slotNumber:2, courseCode: "CS203"},
            {slotNumber:3, courseCode: "Free"}, {slotNumber:4, courseCode: "MA201"},
            {slotNumber:5, courseCode: "EC201"}, {slotNumber:6, courseCode: "Free"},
            {slotNumber:7, courseCode: "Free"}, {slotNumber:8, courseCode: "Free"}
        ]},
        { dayOfWeek: "Tuesday", slots: [
            {slotNumber:1, courseCode: "MA201"}, {slotNumber:2, courseCode: "CS201"},
            {slotNumber:3, courseCode: "EC201"}, {slotNumber:4, courseCode: "CS203"},
            {slotNumber:5, courseCode: "Free"}, {slotNumber:6, courseCode: "Free"},
            {slotNumber:7, courseCode: "Free"}, {slotNumber:8, courseCode: "Free"}
        ]},
        { dayOfWeek: "Wednesday", slots: [
            {slotNumber:1, courseCode: "CS203"}, {slotNumber:2, courseCode: "Free"},
            {slotNumber:3, courseCode: "MA201"}, {slotNumber:4, courseCode: "CS201"},
            {slotNumber:5, courseCode: "EC201"}, {slotNumber:6, courseCode: "Free"},
            {slotNumber:7, courseCode: "Free"}, {slotNumber:8, courseCode: "Free"}
        ]},
        { dayOfWeek: "Thursday", slots: [
            {slotNumber:1, courseCode: "EC201"}, {slotNumber:2, courseCode: "MA201"},
            {slotNumber:3, courseCode: "CS201"}, {slotNumber:4, courseCode: "Free"},
            {slotNumber:5, courseCode: "CS203"}, {slotNumber:6, courseCode: "Free"},
            {slotNumber:7, courseCode: "Free"}, {slotNumber:8, courseCode: "Free"}
        ]},
        { dayOfWeek: "Friday", slots: [
            {slotNumber:1, courseCode: "Free"}, {slotNumber:2, courseCode: "EC201"},
            {slotNumber:3, courseCode: "CS203"}, {slotNumber:4, courseCode: "MA201"},
            {slotNumber:5, courseCode: "CS201"}, {slotNumber:6, courseCode: "Free"},
            {slotNumber:7, courseCode: "Free"}, {slotNumber:8, courseCode: "Free"}
        ]}
      ]
    });
    await sampleTimetable.save();

    console.log("Seeding Faculty...");
    await Faculty.insertMany(seedData.faculty);
    console.log("Seeding Parents...");
    await Parent.insertMany(seedData.parents);

    console.log("Seeding Students with exact Timetable Logs...");
    const modifiedStudents = seedData.students.map(s => {
       // Convert from pure object to matching schema model
       const processed = { ...s };
       if (s.branch === "B.Tech CSE" && s.semester === 3) {
         processed.attendanceLogs = generateMockAttendanceLogs(sampleTimetable, s);
       } else {
         processed.attendanceLogs = [];
       }
       // Drop old attendance map entirely
       delete processed.attendance; 
       delete processed.dailyLogs;
       return processed;
    });
    await Student.insertMany(modifiedStudents);

    console.log("Seeding Messages...");
    const messagesArray = [];
    for (const [studentId, threads] of Object.entries(seedData.messagesByStudentId)) {
      for (const msg of threads) {
        messagesArray.push({
          id: msg.id,
          studentId,
          sender: msg.sender,
          courseCode: msg.courseCode,
          fromName: msg.fromName,
          text: msg.text,
          ts: msg.ts
        });
      }
    }
    if (messagesArray.length > 0) {
      await Message.insertMany(messagesArray);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

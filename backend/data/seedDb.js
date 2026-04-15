require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../utils/db");
const { seedData } = require("./seedData");

const Faculty = require("../models/Faculty");
const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Message = require("../models/Message");

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log("Clearing existing data...");
    await Faculty.deleteMany({});
    await Parent.deleteMany({});
    await Student.deleteMany({});
    await Message.deleteMany({});

    console.log("Seeding Faculty...");
    await Faculty.insertMany(seedData.faculty);

    console.log("Seeding Parents...");
    await Parent.insertMany(seedData.parents);

    console.log("Seeding Students...");
    await Student.insertMany(seedData.students);

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

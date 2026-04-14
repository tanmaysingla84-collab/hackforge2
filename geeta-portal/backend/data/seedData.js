const seedData = {
  faculty: [
    { username: "alokverma", password: "GU@faculty", name: "Dr. Alok Verma" },
    { username: "neerajsingh", password: "GU@faculty", name: "Prof. Neeraj Singh" },
    { username: "sunitasharma", password: "GU@faculty", name: "Dr. Sunita Sharma" },
    { username: "kavitadas", password: "GU@faculty", name: "Mrs. Kavita Das" },
    { username: "rkkapoor", password: "GU@faculty", name: "Dr. R.K. Kapoor" },
    { username: "sandeepyadav", password: "GU@faculty", name: "Dr. Sandeep Yadav" },
    { username: "anilkumar", password: "GU@faculty", name: "Prof. Anil Kumar" },
    { username: "reenagupta", password: "GU@faculty", name: "Mrs. Reena Gupta" },
    { username: "vikramsethi", password: "GU@faculty", name: "Dr. Vikram Sethi" },
    { username: "hsbhatia", password: "GU@faculty", name: "Dr. H.S. Bhatia" },
    { username: "dineshlal", password: "GU@faculty", name: "Prof. Dinesh Lal" },
    { username: "rajivnanda", password: "GU@faculty", name: "Mr. Rajiv Nanda" },
    { username: "shaliniroy", password: "GU@faculty", name: "Dr. Shalini Roy" },
  ],
  parents: [
    { id: "parent1", username: "parent1", password: "GU@parent1", name: "Arjun Sharma", studentId: "2210001", branch: "B.Tech CSE" },
    { id: "parent2", username: "parent2", password: "GU@parent2", name: "Priya Singh", studentId: "2210002", branch: "B.Tech ECE" },
    { id: "parent3", username: "parent3", password: "GU@parent3", name: "Rahul Verma", studentId: "2210003", branch: "B.Tech ME" }
  ],
  students: [
    {
      id: "2210001",
      name: "Arjun Sharma",
      rollNo: "2210001",
      branch: "B.Tech CSE",
      semester: 3,
      section: "A",
      theoryCourses: [
        { code: "CS301", name: "Data Structures", a1: 21, a2: 18, mid: 46, a3: 22, a4: 20, end: 82, teacherName: "Dr. Alok Verma", teacherPhone: "+91-9876543210" },
        { code: "CS302", name: "Computer Organization", a1: 17, a2: 20, mid: 41, a3: 19, a4: 16, end: 77, teacherName: "Prof. Neeraj Singh", teacherPhone: "+91-9876543211" },
        { code: "CS303", name: "Discrete Mathematics", a1: 22, a2: 23, mid: 52, a3: 21, a4: 24, end: 88, teacherName: "Dr. Sunita Sharma", teacherPhone: "+91-9876543212" },
        { code: "CS304", name: "Object Oriented Programming", a1: 19, a2: 21, mid: 48, a3: 23, a4: 22, end: 85, teacherName: "Mrs. Kavita Das", teacherPhone: "+91-9876543213" },
        { code: "MA301", name: "Engineering Mathematics III", a1: 15, a2: 17, mid: 38, a3: 18, a4: 15, end: 70, teacherName: "Dr. R.K. Kapoor", teacherPhone: "+91-9876543214" }
      ],
      labCourses: [
        { code: "CS311", name: "Data Structures Lab", labA1: 22, labA2: 23 },
        { code: "CS312", name: "OOP Lab", labA1: 20, labA2: 21 }
      ],
      attendance: {
        CS301: 82,
        CS302: 68,
        CS303: 91,
        CS304: 78,
        MA301: 71,
        CS311: 88,
        CS312: 85
      }
    },
    {
      id: "2210002",
      name: "Priya Singh",
      rollNo: "2210002",
      branch: "B.Tech ECE",
      semester: 3,
      section: "B",
      theoryCourses: [
        { code: "EC301", name: "Analog Electronics", a1: 20, a2: 22, mid: 49, a3: 23, a4: 21, end: 85, teacherName: "Dr. Sandeep Yadav", teacherPhone: "+91-8765432109" },
        { code: "EC302", name: "Signals & Systems", a1: 16, a2: 14, mid: 36, a3: 17, a4: 13, end: 68, teacherName: "Prof. Anil Kumar", teacherPhone: "+91-8765432110" },
        { code: "EC303", name: "Digital Electronics", a1: 23, a2: 24, mid: 54, a3: 22, a4: 24, end: 92, teacherName: "Mrs. Reena Gupta", teacherPhone: "+91-8765432111" },
        { code: "EC304", name: "Electromagnetic Theory", a1: 18, a2: 19, mid: 44, a3: 20, a4: 18, end: 78, teacherName: "Dr. Vikram Sethi", teacherPhone: "+91-8765432112" },
        { code: "MA301", name: "Engineering Mathematics III", a1: 21, a2: 20, mid: 47, a3: 22, a4: 21, end: 81, teacherName: "Dr. R.K. Kapoor", teacherPhone: "+91-9876543214" }
      ],
      labCourses: [
        { code: "EC311", name: "Analog Electronics Lab", labA1: 21, labA2: 22 },
        { code: "EC312", name: "Digital Electronics Lab", labA1: 24, labA2: 23 }
      ],
      attendance: {
        EC301: 85,
        EC302: 72,
        EC303: 90,
        EC304: 81,
        MA301: 80,
        EC311: 88,
        EC312: 86
      }
    },
    {
      id: "2210003",
      name: "Rahul Verma",
      rollNo: "2210003",
      branch: "B.Tech ME",
      semester: 3,
      section: "A",
      theoryCourses: [
        { code: "ME301", name: "Thermodynamics", a1: 14, a2: 16, mid: 37, a3: 15, a4: 12, end: 62, teacherName: "Dr. H.S. Bhatia", teacherPhone: "+91-7654321098" },
        { code: "ME302", name: "Fluid Mechanics", a1: 19, a2: 18, mid: 43, a3: 20, a4: 19, end: 76, teacherName: "Prof. Dinesh Lal", teacherPhone: "+91-7654321099" },
        { code: "ME303", name: "Manufacturing Processes", a1: 22, a2: 21, mid: 50, a3: 23, a4: 22, end: 89, teacherName: "Mr. Rajiv Nanda", teacherPhone: "+91-7654321100" },
        { code: "ME304", name: "Engineering Materials", a1: 17, a2: 19, mid: 41, a3: 18, a4: 16, end: 74, teacherName: "Dr. Shalini Roy", teacherPhone: "+91-7654321101" },
        { code: "MA301", name: "Engineering Mathematics III", a1: 13, a2: 15, mid: 35, a3: 14, a4: 11, end: 55, teacherName: "Dr. R.K. Kapoor", teacherPhone: "+91-9876543214" }
      ],
      labCourses: [
        { code: "ME311", name: "Fluid Mechanics Lab", labA1: 20, labA2: 21 },
        { code: "ME312", name: "Manufacturing Lab", labA1: 23, labA2: 22 }
      ],
      attendance: {
        ME301: 69,
        ME302: 80,
        ME303: 88,
        ME304: 73,
        MA301: 65,
        ME311: 85,
        ME312: 87
      }
    }
  ],
  messagesByStudentId: {
    "2210001": [
      {
        id: "m1",
        sender: "teacher",
        courseCode: "CS301",
        fromName: "CS301 Teacher",
        text: "Arjun has shown improvement in Data Structures. Please ensure he completes the pending assignment by Friday.",
        ts: "2026-04-07T10:15:00.000Z"
      },
      {
        id: "m2",
        sender: "teacher",
        courseCode: "MA301",
        fromName: "MA301 Teacher",
        text: "Arjun's Mathematics attendance is concerning at 71%. Please encourage regular attendance.",
        ts: "2026-04-10T09:40:00.000Z"
      }
    ],
    "2210002": [],
    "2210003": []
  }
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// In-memory store (mutable at runtime for demo)
const store = clone(seedData);

module.exports = {
  seedData,
  store
};

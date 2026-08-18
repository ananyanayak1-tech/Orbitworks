const bcrypt = require('bcryptjs');
const { connectToServer, getDb, closeConnection } = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding process...");
    
    // Connect to database
    await connectToServer();
    const db = getDb();
    
    // 1. Clean existing collections
    const collections = ['users', 'employees', 'tasks', 'attendance', 'leaves', 'announcements', 'holidays', 'departments', 'projects', 'notifications'];
    for (const coll of collections) {
      const exists = await db.listCollections({ name: coll }).hasNext();
      if (exists) {
        await db.collection(coll).drop();
        console.log(`Dropped existing collection: ${coll}`);
      }
    }

    // 2. Hash passwords
    console.log("Hashing default user passwords...");
    const salt = await bcrypt.genSalt(10);
    const standardHashedPassword = await bcrypt.hash('password123', salt);

    // 3. Create Users
    console.log("Seeding users...");
    const mockUsers = [
      {
        email: "ceo@orbitworks.com",
        password: standardHashedPassword,
        role: "CEO",
        name: "Rajesh Kumar"
      },
      {
        email: "hr@orbitworks.com",
        password: standardHashedPassword,
        role: "HR",
        name: "Pooja Sharma"
      },
      {
        email: "admin@orbitworks.com",
        password: standardHashedPassword,
        role: "HR",
        name: "Sarah Jenkins"
      },
      {
        email: "employee@orbitworks.com",
        password: standardHashedPassword,
        role: "employee",
        name: "Alex Carter"
      },
      {
        email: "dev@orbitworks.com",
        password: standardHashedPassword,
        role: "employee",
        name: "John Doe"
      }
    ];

    const usersResult = await db.collection('users').insertMany(mockUsers);
    console.log(`Inserted ${usersResult.insertedCount} users.`);

    const ceoUser = mockUsers[0];
    const hrUser = mockUsers[1];
    const adminUser = mockUsers[2];
    const employeeUser = mockUsers[3];
    const devUser = mockUsers[4];

    ceoUser._id = usersResult.insertedIds[0];
    hrUser._id = usersResult.insertedIds[1];
    adminUser._id = usersResult.insertedIds[2];
    employeeUser._id = usersResult.insertedIds[3];
    devUser._id = usersResult.insertedIds[4];

    // 4. Create Employees
    console.log("Seeding employees...");
    const mockEmployees = [
      {
        userId: ceoUser._id,
        id: "EMP000",
        name: "Rajesh Kumar",
        department: "Management",
        designation: "CEO & Founder",
        email: "ceo@orbitworks.com",
        phone: "9876543201",
        emergencyContact: "Priya Kumar (9876543219)",
        joiningDate: "2022-01-01T00:00:00Z",
        status: "Active",
        skills: ["Strategy", "Leadership", "Financial Steering"],
        assets: ["MacBook Pro 16", "iPhone 15 Pro Max"],
        documents: []
      },
      {
        userId: hrUser._id,
        id: "EMP004",
        name: "Pooja Sharma",
        department: "Human Resources",
        designation: "HR Officer",
        email: "hr@orbitworks.com",
        phone: "9876543202",
        emergencyContact: "Anil Sharma (9876543229)",
        joiningDate: "2024-02-15T00:00:00Z",
        status: "Active",
        skills: ["Recruiting", "Employee Wellness", "Onboarding"],
        assets: ["Dell Latitude 7440"],
        documents: []
      },
      {
        userId: adminUser._id,
        id: "EMP001",
        name: "Sarah Jenkins",
        department: "Human Resources",
        designation: "HR Manager",
        email: "admin@orbitworks.com",
        phone: "9876543203",
        emergencyContact: "Robert Jenkins (9876543239)",
        joiningDate: "2023-01-15T00:00:00Z",
        status: "Active",
        skills: ["Recruiting", "Payroll Management", "Conflict Resolution", "Performance Reviews"],
        assets: ["MacBook Pro 14", "External Display 27", "Office Chair"],
        documents: []
      },
      {
        userId: employeeUser._id,
        id: "EMP003",
        name: "Alex Carter",
        department: "Engineering",
        designation: "Software Engineer",
        email: "employee@orbitworks.com",
        phone: "9876543204",
        emergencyContact: "Jane Carter (9876543249)",
        joiningDate: "2024-06-01T00:00:00Z",
        status: "Active",
        skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "CSS"],
        assets: ["ThinkPad L14", "Noise Cancelling Headphones"],
        documents: []
      },
      {
        userId: devUser._id,
        id: "EMP002",
        name: "John Doe",
        department: "Engineering",
        designation: "Frontend Developer",
        email: "dev@orbitworks.com",
        phone: "9876543205",
        emergencyContact: "Mary Doe (9876543259)",
        joiningDate: "2024-03-10T00:00:00Z",
        status: "Active",
        skills: ["HTML5", "CSS3", "React", "Redux", "Tailwind CSS", "TypeScript"],
        assets: ["MacBook Air M2"],
        documents: []
      }
    ];

    const employeesResult = await db.collection('employees').insertMany(mockEmployees);
    console.log(`Inserted ${employeesResult.insertedCount} employees.`);

    // 5. Create Tasks
    console.log("Seeding tasks...");
    const mockTasks = [
      {
        title: "Implement API Gateway",
        description: "Set up Express routing, token verification middleware, and native database connection logic.",
        status: "In Progress",
        priority: "High",
        dueDate: "2026-08-15T00:00:00Z",
        assignedTo: ["EMP003"],
        comments: [
          {
            id: "comment_1",
            userId: employeeUser._id,
            userName: "Alex Carter",
            text: "Initial routers are set up. Working on the Websocket server integrations now.",
            timestamp: "2026-08-04T12:00:00Z"
          }
        ],
        createdAt: "2026-08-01T10:00:00Z",
        creatorId: adminUser._id
      },
      {
        title: "Design Main Dashboard UI",
        description: "Draft user wireframes and styling configurations for the core OrbitWorks React dashboard panels.",
        status: "To Do",
        priority: "Medium",
        dueDate: "2026-08-20T00:00:00Z",
        assignedTo: ["EMP002"],
        comments: [],
        createdAt: "2026-08-02T11:00:00Z",
        creatorId: adminUser._id
      },
      {
        title: "Prepare Q3 Compliance Audits",
        description: "Audit task allocations, leave balances, and gate scanner attendance logs for audit approval.",
        status: "Done",
        priority: "Low",
        dueDate: "2026-08-04T00:00:00Z",
        assignedTo: ["EMP001"],
        comments: [
          {
            id: "comment_2",
            userId: adminUser._id,
            userName: "Sarah Jenkins",
            text: "Report has been completed and submitted successfully to the legal board.",
            timestamp: "2026-08-04T16:00:00Z"
          }
        ],
        createdAt: "2026-07-28T09:00:00Z",
        creatorId: adminUser._id
      }
    ];

    const tasksResult = await db.collection('tasks').insertMany(mockTasks);
    console.log(`Inserted ${tasksResult.insertedCount} tasks.`);

    // 6. Create Attendance Logs
    console.log("Seeding attendance logs...");
    // Let's get actual date formats
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const mockAttendance = [
      // Today logs
      {
        userId: employeeUser._id,
        employeeId: "EMP003",
        name: "Alex Carter",
        date: todayStr,
        checkIn: `${todayStr}T09:15:23.000Z`,
        checkOut: null,
        status: "Present"
      },
      {
        userId: adminUser._id,
        employeeId: "EMP001",
        name: "Sarah Jenkins",
        date: todayStr,
        checkIn: `${todayStr}T08:50:11.000Z`,
        checkOut: `${todayStr}T17:30:00.000Z`,
        status: "Present"
      },
      // Yesterday logs
      {
        userId: employeeUser._id,
        employeeId: "EMP003",
        name: "Alex Carter",
        date: yesterdayStr,
        checkIn: `${yesterdayStr}T09:02:44.000Z`,
        checkOut: `${yesterdayStr}T18:05:12.000Z`,
        status: "Present"
      },
      {
        userId: devUser._id,
        employeeId: "EMP002",
        name: "John Doe",
        date: yesterdayStr,
        checkIn: `${yesterdayStr}T09:30:00.000Z`,
        checkOut: `${yesterdayStr}T17:00:00.000Z`,
        status: "Present"
      },
      {
        userId: adminUser._id,
        employeeId: "EMP001",
        name: "Sarah Jenkins",
        date: yesterdayStr,
        checkIn: `${yesterdayStr}T08:55:10.000Z`,
        checkOut: `${yesterdayStr}T17:40:00.000Z`,
        status: "Present"
      }
    ];

    const attendanceResult = await db.collection('attendance').insertMany(mockAttendance);
    console.log(`Inserted ${attendanceResult.insertedCount} attendance records.`);

    // 7. Create Leave Logs
    console.log("Seeding leaves...");
    const nextWeekStart = new Date();
    nextWeekStart.setDate(today.getDate() + 7);
    const nextWeekStartStr = nextWeekStart.toISOString().split('T')[0];

    const nextWeekEnd = new Date();
    nextWeekEnd.setDate(today.getDate() + 8);
    const nextWeekEndStr = nextWeekEnd.toISOString().split('T')[0];

    const mockLeaves = [
      {
        userId: employeeUser._id,
        employeeId: "EMP003",
        name: "Alex Carter",
        type: "WFH",
        startDate: `${nextWeekStartStr}T09:00:00.000Z`,
        endDate: `${nextWeekEndStr}T18:00:00.000Z`,
        reason: "Working from home to focus on uninterrupted server integration tasks.",
        status: "Pending",
        createdAt: today.toISOString()
      },
      {
        userId: devUser._id,
        employeeId: "EMP002",
        name: "John Doe",
        type: "Sick Leave",
        startDate: `${yesterdayStr}T09:00:00.000Z`,
        endDate: `${yesterdayStr}T18:00:00.000Z`,
        reason: "Medical check-up",
        status: "Approved",
        createdAt: yesterday.toISOString(),
        reviewedBy: "Sarah Jenkins",
        reviewedAt: yesterday.toISOString()
      }
    ];

    const leavesResult = await db.collection('leaves').insertMany(mockLeaves);
    console.log(`Inserted ${leavesResult.insertedCount} leave requests.`);

    // 8. Create Announcements
    console.log("Seeding announcements...");
    const mockAnnouncements = [
      {
        title: "OrbitWorks Annual Hackathon",
        content: "We are thrilled to announce the upcoming 48-hour OrbitWorks Hackathon scheduled for August 28-30. Start brainstorming team ideas and technical projects! Prizes will be awarded for innovation, design, and execution.",
        category: "Event",
        author: "Sarah Jenkins",
        createdAt: today.toISOString()
      },
      {
        title: "Q3 Remote Work Guideline Policy Updates",
        content: "Please note that the updated policy guidelines regarding WFH allocations and asset requisitions have been posted to the employee handbook wiki. All team members are requested to review them by next Friday.",
        category: "Policy",
        author: "Sarah Jenkins",
        createdAt: yesterday.toISOString()
      }
    ];

    const announcementsResult = await db.collection('announcements').insertMany(mockAnnouncements);
    console.log(`Inserted ${announcementsResult.insertedCount} announcements.`);

    // 9. Create Holidays
    console.log("Seeding holidays...");
    const currentYear = today.getFullYear();
    const mockHolidays = [
      {
        name: "Independence Day",
        date: `${currentYear}-07-04`,
        description: "US Independence Day Holiday",
        type: "National",
        createdAt: today.toISOString()
      },
      {
        name: "Labor Day",
        date: `${currentYear}-09-07`,
        description: "Labor Day Tribute Holiday",
        type: "National",
        createdAt: today.toISOString()
      },
      {
        name: "Thanksgiving Day",
        date: `${currentYear}-11-26`,
        description: "Thanksgiving Day Harvest",
        type: "National",
        createdAt: today.toISOString()
      },
      {
        name: "Christmas Day",
        date: `${currentYear}-12-25`,
        description: "Christmas Celebration Holiday",
        type: "National",
        createdAt: today.toISOString()
      }
    ];

    const holidaysResult = await db.collection('holidays').insertMany(mockHolidays);
    console.log(`Inserted ${holidaysResult.insertedCount} holidays.`);

    // 10. Create Departments
    console.log("Seeding departments...");
    const mockDepts = [
      { name: 'Management', head: 'Rajesh Kumar', employeesCount: 1, budget: '$150,000/yr', description: 'Executive steering and company strategy' },
      { name: 'Human Resources', head: 'Pooja Sharma', employeesCount: 1, budget: '$80,000/yr', description: 'Employee relations, onboarding, and recruitment' },
      { name: 'Engineering', head: 'Rohan Sharma', employeesCount: 2, budget: '$350,000/yr', description: 'Software design, coding, and production support' },
      { name: 'Design', head: 'Priya Iyer', employeesCount: 1, budget: '$90,000/yr', description: 'User experience, UI layouts, and branding graphics' }
    ];
    const deptsResult = await db.collection('departments').insertMany(mockDepts);
    for (const key in deptsResult.insertedIds) {
      const id = deptsResult.insertedIds[key].toString();
      await db.collection('departments').updateOne({ _id: deptsResult.insertedIds[key] }, { $set: { id } });
    }
    console.log(`Inserted ${deptsResult.insertedCount} departments.`);

    // 11. Create Projects
    console.log("Seeding projects...");
    const mockProjs = [
      { name: 'OrbitWorks Frontend Re-Skin', manager: 'Pooja Sharma', startDate: '2026-06-01', endDate: '2026-08-15', progress: 75, status: 'Active', description: 'Upgrading employee portal visual styling and performance' },
      { name: 'Security Audit 2026', manager: 'Rajesh Kumar', startDate: '2026-07-01', endDate: '2026-09-30', progress: 30, status: 'Active', description: 'Annual compliance and authentication hardening protocols' },
      { name: 'Mobile Application Prototype', manager: 'Rohan Sharma', startDate: '2026-08-01', endDate: '2026-11-30', progress: 0, status: 'Planning', description: 'Drafting mobile app layout blueprints for client demo' }
    ];
    const projsResult = await db.collection('projects').insertMany(mockProjs);
    for (const key in projsResult.insertedIds) {
      const id = projsResult.insertedIds[key].toString();
      await db.collection('projects').updateOne({ _id: projsResult.insertedIds[key] }, { $set: { id } });
    }
    console.log(`Inserted ${projsResult.insertedCount} projects.`);

    // 12. Create Notifications
    console.log("Seeding notifications...");
    const mockNotifs = [
      {
        userId: adminUser._id.toString(),
        type: "Leave",
        text: "Alex Carter submitted a new WFH request",
        read: false,
        createdAt: today.toISOString()
      }
    ];
    const notifsResult = await db.collection('notifications').insertMany(mockNotifs);
    console.log(`Inserted ${notifsResult.insertedCount} notifications.`);

    console.log("\nDatabase seeding completed successfully!");
  } catch (err) {
    console.error("Critical error seeding database:", err);
  } finally {
    await closeConnection();
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

require('dotenv').config();
const { connectToServer, getDb, closeConnection } = require('../config/db.js');

async function listEmployees() {
  try {
    await connectToServer();
    const db = getDb();
    
    console.log("\n--- Users in 'users' collection ---");
    const users = await db.collection('users').find().toArray();
    if (users.length === 0) {
      console.log("No users found.");
    } else {
      users.forEach(u => console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`));
    }

    console.log("\n--- Profiles in 'employees' collection ---");
    const employees = await db.collection('employees').find().toArray();
    if (employees.length === 0) {
      console.log("No employees found.");
    } else {
      employees.forEach(e => console.log(`ID: ${e.id} | Name: ${e.name} | Email: ${e.email} | Dept: ${e.department}`));
    }
  } catch (err) {
    console.error("Error fetching list:", err);
  } finally {
    await closeConnection();
  }
}

listEmployees();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { connectToServer, getDb, closeConnection } = require('../config/db.js');

async function runTests() {
  console.log("=== Starting Offline Backend Validation ===");
  
  // 1. Test Bcrypt hashing
  console.log("\n[Test 1] Hashing and comparing passwords with bcryptjs...");
  try {
    const password = "mySecurePassword123";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("Password successfully hashed:", hash.substring(0, 30) + "...");
    const isMatch = await bcrypt.compare(password, hash);
    console.log("Password comparison result:", isMatch ? "SUCCESS (Passwords Match)" : "FAILED (Passwords Mismatch)");
    if (!isMatch) throw new Error("Bcrypt verification failed");
  } catch (err) {
    console.error("Bcrypt test error:", err);
    process.exit(1);
  }

  // 2. Test JWT Signing & Verification
  console.log("\n[Test 2] Signing and verifying JWT tokens...");
  try {
    const payload = { id: "user_test_123", email: "test@orbitworks.com", role: "employee" };
    const secret = process.env.JWT_SECRET || "orbitworks_secret_token_12345";
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    console.log("JWT Token generated:", token.substring(0, 30) + "...");
    const decoded = jwt.verify(token, secret);
    console.log("JWT Token successfully verified. Decoded payload:", decoded);
    if (decoded.email !== payload.email) throw new Error("JWT payload check failed");
  } catch (err) {
    console.error("JWT test error:", err);
    process.exit(1);
  }

  // 3. Test Database connection
  console.log("\n[Test 3] Connecting to MongoDB Atlas database...");
  try {
    await connectToServer();
    const db = getDb();
    console.log("Successfully connected. Checking collections...");
    
    const collections = await db.listCollections().toArray();
    console.log("Collections present in the database:");
    collections.forEach(c => console.log(` - ${c.name}`));
    
    // Check users count
    const usersCount = await db.collection('users').countDocuments();
    const employeesCount = await db.collection('employees').countDocuments();
    const tasksCount = await db.collection('tasks').countDocuments();
    
    console.log(`Database Stats: Users: ${usersCount}, Employees: ${employeesCount}, Tasks: ${tasksCount}`);
    
    if (usersCount === 0 || employeesCount === 0 || tasksCount === 0) {
      throw new Error("Seeded collections are empty!");
    }
    
    console.log("Database connection & content check: SUCCESS");
  } catch (err) {
    console.error("Database connection test error:", err);
    process.exit(1);
  } finally {
    await closeConnection();
  }

  console.log("\n=== All Backend Checks Passed Successfully! ===");
}

runTests();

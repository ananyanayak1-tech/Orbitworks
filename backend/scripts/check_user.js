const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
  console.error("MONGO_URL not found in env");
  process.exit(1);
}

const client = new MongoClient(mongoUri);

async function run() {
  try {
    await client.connect();
    const db = client.db('orbitworks');
    
    const user = await db.collection('users').findOne({ email: 'hr@orbitworks.com' });
    if (!user) {
      console.log("USER hr@orbitworks.com NOT FOUND IN DATABASE!");
      
      console.log("LISTING ALL USERS:");
      const allUsers = await db.collection('users').find().toArray();
      console.log(JSON.stringify(allUsers, null, 2));
      return;
    }
    
    console.log("USER FOUND:", {
      email: user.email,
      role: user.role,
      name: user.name,
      passwordHash: user.password
    });
    
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log("DOES password123 MATCH HASH?:", isMatch);
  } catch (err) {
    console.error("Error during check:", err);
  } finally {
    await client.close();
  }
}

run();

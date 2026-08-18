const { MongoClient } = require('mongodb');
require('dotenv').config();

// Support both MONGO_URL (from user's .env) and MONGODB_URI (standard)
const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Error: MongoDB connection string (MONGO_URL or MONGODB_URI) is not specified in .env");
  process.exit(1);
}

const client = new MongoClient(mongoUri);
let dbConnection;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      // Connect to the specific database 'orbitworks'
      dbConnection = client.db('orbitworks');
      console.log("Successfully connected to MongoDB.");
      return dbConnection;
    } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }
  },
  getDb: function () {
    return dbConnection;
  },
  closeConnection: async function () {
    try {
      await client.close();
      console.log("MongoDB connection closed.");
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
    }
  }
};

const { MongoClient, ObjectId } = require('mongodb');
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
    
    // Find the task Design Main Dashboard UI (ends with 9d)
    const task = await db.collection('tasks').findOne({ _id: new ObjectId("6a82d9a1abff469d3fb9db9d") });
    if (!task) {
      console.log("Task not found");
      return;
    }
    
    console.log("Comments before:", task.comments);
    
    // Pull the comment that matches the text or has index 1
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId("6a82d9a1abff469d3fb9db9d") },
      { $pull: { comments: { text: "can u people do the work quickly" } } }
    );
    
    console.log("Modified count:", result.modifiedCount);
    
    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId("6a82d9a1abff469d3fb9db9d") });
    console.log("Comments after:", updatedTask.comments);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

const { MongoClient } = require('mongodb');
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
    const tasks = await db.collection('tasks').find().toArray();
    console.log("TASKS IN DATABASE:");
    console.log(JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

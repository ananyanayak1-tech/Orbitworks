const { MongoClient } = require('mongodb');
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
    const messages = await db.collection('messages').find().toArray();
    console.log("MESSAGES IN DATABASE:");
    console.log(JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

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
    
    // Update old messages that were sent to EMP004 by Rajesh Kumar (EMP000)
    const result = await db.collection('messages').updateMany(
      { room: 'EMP004', senderName: 'Rajesh Kumar' },
      { $set: { room: 'dm_EMP000_EMP004' } }
    );
    
    console.log(`Migrated ${result.modifiedCount} legacy messages.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

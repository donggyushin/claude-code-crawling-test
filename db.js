const { MongoClient } = require('mongodb');

let db;

async function connectToMongoDB() {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    throw new Error('MONGODB_USERNAME and MONGODB_PASSWORD must be set in environment variables');
  }

  const uri = `mongodb+srv://${username}:${password}@cluster0.qbhlio5.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('MongoDB에 성공적으로 연결되었습니다.');
    return db;
  } catch (error) {
    console.error('MongoDB 연결 오류:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongoDB() first.');
  }
  return db;
}

module.exports = { connectToMongoDB, getDB };
const { MongoClient } = require('mongodb');

let db;

async function connectToMongoDB() {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    console.log('MongoDB 환경변수가 설정되지 않았습니다. 데이터베이스 없이 서버를 시작합니다.');
    return null;
  }

  const uri = `mongodb+srv://${username}:${password}@cluster0.qbhlio5.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    db = client.db();
    console.log('MongoDB에 성공적으로 연결되었습니다.');
    return db;
  } catch (error) {
    console.error('MongoDB 연결 오류:', error.message);
    console.log('데이터베이스 없이 서버를 시작합니다.');
    return null;
  }
}

function getDB() {
  return db;
}

module.exports = { connectToMongoDB, getDB };
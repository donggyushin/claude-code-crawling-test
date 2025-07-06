// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToMongoDB, getDB } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// 라우트
app.get('/', (req, res) => {
  res.json({ message: 'API 서버가 정상 작동중입니다!' });
});

app.get('/health', async (req, res) => {
  try {
    const db = getDB();
    await db.admin().ping();
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();
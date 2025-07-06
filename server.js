// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToMongoDB } = require('./db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// 라우트
app.use('/', routes);

// 에러 핸들러
app.use(notFound);
app.use(errorHandler);

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
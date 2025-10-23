// server/index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const config = require('./config/key');

// --- DB 연결 (mongoose v7 권장 형식)
mongoose.connect(config.mongoURI, {
  dbName: process.env.MONGO_DB || 'app',
})
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

// --- 미들웨어
app.use(cors({
  origin: 'http://localhost:3000', // 프론트 주소
  credentials: true,                 // 쿠키 인증이라면 필수
}));
app.use(express.urlencoded({ extended: true })); // body-parser 대체
app.use(express.json());                          // body-parser 대체
app.use(cookieParser());

// --- API 라우트
app.use('/api/users', require('./routes/users'));

app.use('/api/favorite', require('./routes/favorite'));

// --- 업로드 정적 경로
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 프로덕션일 때 리액트 정적 서빙
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

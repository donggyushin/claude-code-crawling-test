const express = require('express');
const healthRoutes = require('./health');
const stockRoutes = require('./stock');
const crawlingRoutes = require('./crawling');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/stock', stockRoutes);
router.use('/crawling', crawlingRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API 서버가 정상 작동중입니다!' });
});

module.exports = router;
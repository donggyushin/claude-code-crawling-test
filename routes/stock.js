const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/analyze/:symbol', stockController.analyzeStock);

module.exports = router;
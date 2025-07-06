const express = require('express');
const CrawlingController = require('../controllers/crawlingController');

const router = express.Router();

router.get('/scrape', CrawlingController.scrapeVenues);
router.post('/scrape-and-save', CrawlingController.scrapeAndSave);

module.exports = router;
const express = require('express');
const CrawlingController = require('../controllers/crawlingController');

const router = express.Router();

// File operations
router.get('/scrape', CrawlingController.scrapeVenues);
router.post('/scrape-and-save', CrawlingController.scrapeAndSave);

// Store detail operations
router.get('/store/:storeId', CrawlingController.getStoreDetail);

// MongoDB operations
router.post('/scrape-and-save-to-mongodb', CrawlingController.scrapeAndSaveToMongoDB);
router.get('/venues', CrawlingController.getVenuesFromMongoDB);
router.delete('/venues', CrawlingController.deleteVenuesFromMongoDB);

module.exports = router;
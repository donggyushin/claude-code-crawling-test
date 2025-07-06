const CrawlingService = require('../services/crawlingService');

class CrawlingController {
    static async scrapeVenues(req, res) {
        try {
            const crawlingService = new CrawlingService();
            const result = await crawlingService.scrapeVenues();

            if (result.success) {
                res.json({
                    success: true,
                    message: `Successfully scraped ${result.count} venues`,
                    title: result.title,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to scrape venues',
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async scrapeAndSave(req, res) {
        try {
            const { format = 'json', filename } = req.body;
            
            const crawlingService = new CrawlingService();
            const scrapeResult = await crawlingService.scrapeVenues();

            if (!scrapeResult.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to scrape venues',
                    error: scrapeResult.error
                });
            }

            const saveResult = await crawlingService.saveToFile(filename, format);

            res.json({
                success: true,
                message: `Successfully scraped ${scrapeResult.count} venues and saved to file`,
                title: scrapeResult.title,
                scrapeData: {
                    count: scrapeResult.count,
                    venues: scrapeResult.data
                },
                fileData: saveResult
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async scrapeAndSaveToMongoDB(req, res) {
        try {
            const { collection = 'venues' } = req.body;
            
            const crawlingService = new CrawlingService();
            const result = await crawlingService.scrapeAndSaveToMongoDB(collection);

            if (result.success) {
                res.json({
                    success: true,
                    message: `Successfully scraped ${result.scrapeData.count} venues and saved to MongoDB`,
                    title: result.title,
                    scrapeData: result.scrapeData,
                    mongoData: result.mongoData
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to scrape and save to MongoDB',
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async getVenuesFromMongoDB(req, res) {
        try {
            const { collection = 'venues' } = req.query;
            const filter = {};
            
            // Add optional filters
            if (req.query.name) {
                filter.name = { $regex: req.query.name, $options: 'i' };
            }
            if (req.query.address) {
                filter.address = { $regex: req.query.address, $options: 'i' };
            }
            if (req.query.storeId) {
                filter.storeId = req.query.storeId;
            }

            const crawlingService = new CrawlingService();
            const result = await crawlingService.getFromMongoDB(collection, filter);

            res.json({
                success: true,
                message: `Retrieved ${result.count} venues from MongoDB`,
                collection: collection,
                data: result.data
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve venues from MongoDB',
                error: error.message
            });
        }
    }

    static async deleteVenuesFromMongoDB(req, res) {
        try {
            const { collection = 'venues' } = req.body;
            const filter = {};

            // Add optional filters for deletion
            if (req.body.storeId) {
                filter.storeId = req.body.storeId;
            }
            if (req.body.name) {
                filter.name = req.body.name;
            }

            const crawlingService = new CrawlingService();
            const result = await crawlingService.deleteFromMongoDB(collection, filter);

            res.json({
                success: true,
                message: `Deleted ${result.deletedCount} venues from MongoDB`,
                collection: result.collection,
                deletedCount: result.deletedCount
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete venues from MongoDB',
                error: error.message
            });
        }
    }

    static async getStoreDetail(req, res) {
        try {
            const { storeId } = req.params;
            
            if (!storeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Store ID is required'
                });
            }

            const crawlingService = new CrawlingService();
            const result = await crawlingService.scrapeStoreDetail(storeId);

            if (result.success) {
                res.json({
                    success: true,
                    message: `Successfully retrieved store details for ${storeId}`,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve store details',
                    error: result.error
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = CrawlingController;
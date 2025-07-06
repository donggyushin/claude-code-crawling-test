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
}

module.exports = CrawlingController;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { getDB } = require('../db');

class CrawlingService {
    constructor() {
        this.baseUrl = 'https://xn--2s2b33eb3kgvpta.com/collection/7';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };
        this.data = [];
    }

    async scrapeVenues() {
        try {
            const response = await axios.get(this.baseUrl, { headers: this.headers });
            const $ = cheerio.load(response.data);
            
            let title = '';
            const jsonScripts = $('script[type="application/ld+json"]');
            
            jsonScripts.each((index, element) => {
                try {
                    const jsonContent = $(element).html();
                    
                    const jsonData = JSON.parse(jsonContent);
                    
                    if (jsonData['@type'] === 'ItemList' && jsonData.itemListElement) {
                        title = jsonData.name || '';
                        
                        jsonData.itemListElement.forEach(listItem => {
                            const item = listItem.item;
                            if (item && item['@type'] === 'LocalBusiness') {
                                const tags = [];
                                
                                // For now, we'll extract tags from a general approach
                                // Tags might be loaded dynamically, so we'll provide placeholder
                                const generalTags = ['LP바', '카페', '감성', '서울', '데이트코스'];
                                tags.push(...generalTags);
                                
                                // Extract store ID from URL (e.g., "/store/S230729_1690642444676" -> "S230729_1690642444676")
                                const storeUrl = item.url || '';
                                const storeId = storeUrl.split('/').pop() || '';
                                
                                const venueInfo = {
                                    name: item.name || '',
                                    address: item.address?.addressLocality || '',
                                    country: item.address?.addressCountry || '',
                                    latitude: item.geo?.latitude || '',
                                    longitude: item.geo?.longitude || '',
                                    imageUrl: item.image || '',
                                    storeId: storeId,
                                    tags: tags
                                };
                                this.data.push(venueInfo);
                            }
                        });
                    } else if (Array.isArray(jsonData)) {
                        jsonData.forEach(item => {
                            if (item['@type'] === 'LocalBusiness') {
                                const tags = [];
                                
                                // For now, we'll extract tags from a general approach
                                // Tags might be loaded dynamically, so we'll provide placeholder
                                const generalTags = ['LP바', '카페', '감성', '서울', '데이트코스'];
                                tags.push(...generalTags);
                                
                                // Extract store ID from URL (e.g., "/store/S230729_1690642444676" -> "S230729_1690642444676")
                                const storeUrl = item.url || '';
                                const storeId = storeUrl.split('/').pop() || '';
                                
                                const venueInfo = {
                                    name: item.name || '',
                                    address: item.address?.addressLocality || '',
                                    country: item.address?.addressCountry || '',
                                    latitude: item.geo?.latitude || '',
                                    longitude: item.geo?.longitude || '',
                                    imageUrl: item.image || '',
                                    storeId: storeId,
                                    tags: tags
                                };
                                this.data.push(venueInfo);
                            }
                        });
                    }
                } catch (parseError) {
                    console.warn('Failed to parse JSON-LD:', parseError.message);
                }
            });

            return {
                success: true,
                count: this.data.length,
                title: title,
                data: this.data
            };

        } catch (error) {
            console.error('Error scraping venues:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async saveToFile(filename = null, format = 'json') {
        if (this.data.length === 0) {
            throw new Error('No data to save');
        }

        const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 15);
        const defaultFilename = `seoul_venues_${timestamp}.${format}`;
        const finalFilename = filename || defaultFilename;
        const filePath = path.join(__dirname, '..', 'data', finalFilename);

        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });

            if (format === 'json') {
                await fs.writeFile(filePath, JSON.stringify(this.data, null, 2), 'utf8');
            } else if (format === 'csv') {
                const csvContent = this.convertToCSV(this.data);
                await fs.writeFile(filePath, csvContent, 'utf8');
            }

            return {
                success: true,
                filename: finalFilename,
                path: filePath,
                count: this.data.length
            };

        } catch (error) {
            console.error('Error saving file:', error.message);
            throw error;
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = [];
    }

    async saveToMongoDB(collectionName = 'venues') {
        const db = getDB();
        if (!db) {
            throw new Error('MongoDB connection not available');
        }

        if (this.data.length === 0) {
            throw new Error('No data to save to MongoDB');
        }

        try {
            const collection = db.collection(collectionName);
            
            // Use upsert to avoid duplicates based on storeId
            const bulkOps = this.data.map(venue => ({
                updateOne: {
                    filter: { storeId: venue.storeId },
                    update: { 
                        $set: { 
                            ...venue, 
                            updatedAt: new Date() 
                        },
                        $setOnInsert: { 
                            createdAt: new Date() 
                        }
                    },
                    upsert: true
                }
            }));

            const result = await collection.bulkWrite(bulkOps);

            return {
                success: true,
                inserted: result.upsertedCount,
                updated: result.modifiedCount,
                total: this.data.length,
                collection: collectionName
            };

        } catch (error) {
            console.error('Error saving to MongoDB:', error.message);
            throw error;
        }
    }

    async getFromMongoDB(collectionName = 'venues', filter = {}) {
        const db = getDB();
        if (!db) {
            throw new Error('MongoDB connection not available');
        }

        try {
            const collection = db.collection(collectionName);
            const venues = await collection.find(filter).toArray();

            return {
                success: true,
                count: venues.length,
                data: venues
            };

        } catch (error) {
            console.error('Error retrieving from MongoDB:', error.message);
            throw error;
        }
    }

    async deleteFromMongoDB(collectionName = 'venues', filter = {}) {
        const db = getDB();
        if (!db) {
            throw new Error('MongoDB connection not available');
        }

        try {
            const collection = db.collection(collectionName);
            const result = await collection.deleteMany(filter);

            return {
                success: true,
                deletedCount: result.deletedCount,
                collection: collectionName
            };

        } catch (error) {
            console.error('Error deleting from MongoDB:', error.message);
            throw error;
        }
    }

    async scrapeAndSaveToMongoDB(collectionName = 'venues') {
        try {
            // First scrape the data
            const scrapeResult = await this.scrapeVenues();
            
            if (!scrapeResult.success) {
                return scrapeResult;
            }

            // Then save to MongoDB
            const saveResult = await this.saveToMongoDB(collectionName);

            return {
                success: true,
                title: scrapeResult.title,
                scrapeData: {
                    count: scrapeResult.count,
                    venues: scrapeResult.data
                },
                mongoData: saveResult
            };

        } catch (error) {
            console.error('Error in scrapeAndSaveToMongoDB:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async scrapeStoreDetail(storeId) {
        try {
            const storeUrl = `https://xn--2s2b33eb3kgvpta.com/store/${storeId}`;
            const response = await axios.get(storeUrl, { headers: this.headers });
            const $ = cheerio.load(response.data);
            
            let storeDetail = {
                storeId: storeId,
                storeUrl: storeUrl
            };

            // Extract JSON-LD structured data
            const jsonScripts = $('script[type="application/ld+json"]');
            
            jsonScripts.each((index, element) => {
                try {
                    const jsonContent = $(element).html();
                    const jsonData = JSON.parse(jsonContent);
                    
                    if (jsonData['@type'] === 'LocalBusiness') {
                        storeDetail = {
                            ...storeDetail,
                            name: jsonData.name || '',
                            description: jsonData.description || '',
                            address: {
                                full: jsonData.address?.streetAddress || '',
                                locality: jsonData.address?.addressLocality || '',
                                region: jsonData.address?.addressRegion || '',
                                country: jsonData.address?.addressCountry || ''
                            },
                            phone: jsonData.telephone || '',
                            rating: jsonData.aggregateRating?.ratingValue || null,
                            reviewCount: jsonData.aggregateRating?.reviewCount || 0,
                            latitude: jsonData.geo?.latitude || '',
                            longitude: jsonData.geo?.longitude || '',
                            images: jsonData.image || []
                        };
                    }
                } catch (parseError) {
                    console.warn('Failed to parse JSON-LD in store detail:', parseError.message);
                }
            });

            // Extract additional details from HTML if needed
            try {
                // Extract business hours if available
                const hoursElement = $('.hours, .business-hours, [class*="hour"]');
                if (hoursElement.length > 0) {
                    storeDetail.businessHours = hoursElement.text().trim();
                }

                // Extract additional images from gallery
                const imageElements = $('img[src*="/images/"]');
                const additionalImages = [];
                imageElements.each((i, img) => {
                    const imgSrc = $(img).attr('src');
                    if (imgSrc && !additionalImages.includes(imgSrc)) {
                        additionalImages.push(imgSrc);
                    }
                });
                
                if (additionalImages.length > 0) {
                    storeDetail.additionalImages = additionalImages;
                }
            } catch (htmlParseError) {
                console.warn('Failed to parse additional HTML details:', htmlParseError.message);
            }

            return {
                success: true,
                data: storeDetail
            };

        } catch (error) {
            console.error('Error scraping store detail:', error.message);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }
}

module.exports = CrawlingService;
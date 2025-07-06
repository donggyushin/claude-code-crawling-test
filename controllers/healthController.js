const { getDB } = require('../db');

const checkHealth = async (req, res) => {
  try {
    const db = getDB();
    if (db) {
      await db.admin().ping();
      res.json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({ 
        status: 'healthy',
        database: 'not configured',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  checkHealth
};
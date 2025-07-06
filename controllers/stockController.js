const StockAnalysisService = require('../services/stockAnalysisService');

const stockAnalysisService = new StockAnalysisService();

const analyzeStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({ 
        error: 'Stock symbol is required' 
      });
    }

    const normalizedSymbol = symbol.toUpperCase().trim();
    
    const analysis = await stockAnalysisService.analyzeStockSymbol(normalizedSymbol);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stock analysis error:', error);
    
    let statusCode = 500;
    let errorMessage = '주식 분석 중 오류가 발생했습니다.';
    
    if (error.message.includes('Invalid stock symbol')) {
      statusCode = 404;
      errorMessage = '유효하지 않은 주식 심볼입니다.';
    } else if (error.message.includes('API call frequency limit')) {
      statusCode = 429;
      errorMessage = 'API 호출 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (error.message.includes('API Error')) {
      statusCode = 502;
      errorMessage = '외부 API 서비스에 문제가 있습니다.';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  analyzeStock
};
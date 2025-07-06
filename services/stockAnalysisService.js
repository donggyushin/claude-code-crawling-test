const axios = require('axios');

class StockAnalysisService {
  constructor() {
    this.ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    this.BASE_URL = 'https://www.alphavantage.co/query';
  }

  async getStockData(symbol) {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: this.ALPHA_VANTAGE_API_KEY,
          outputsize: 'compact'
        }
      });

      if (response.data['Error Message']) {
        throw new Error('Invalid stock symbol');
      }

      if (response.data['Note']) {
        throw new Error('API call frequency limit reached');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status}`);
      }
      throw error;
    }
  }

  // 주식 분석을 위한 기술적 지표(RSI, MACD, SMA) 조회
  // 점수 계산 로직:
  // - RSI > 70: -1점 (과매수, 매도 신호)
  // - RSI < 30: +1점 (과매도, 매수 신호)
  // - MACD > 0: +1점 (강세 모멘텀)
  // - MACD < 0: -1점 (약세 모멘텀)
  // - 현재가 > SMA50: +1점 (평균 상회, 강세)
  // - 현재가 < SMA50: -1점 (평균 하회, 약세)
  // - 거래량 > 평균의 1.5배: +0.5점 (높은 관심도)
  // - 가격 변화 > 5%: +1점 (강한 상승세)
  // - 가격 변화 < -5%: -1점 (강한 하락세)
  // 최종 추천: 점수 >= 2 (매수), 점수 <= -2 (매도), 그 외 (보유)
  async getTechnicalIndicators(symbol) {
    try {
      const [rsiResponse, macdResponse, smaResponse] = await Promise.all([
        axios.get(this.BASE_URL, {
          params: {
            function: 'RSI',
            symbol: symbol,
            interval: 'daily',
            time_period: 14,
            series_type: 'close',
            apikey: this.ALPHA_VANTAGE_API_KEY
          }
        }),
        axios.get(this.BASE_URL, {
          params: {
            function: 'MACD',
            symbol: symbol,
            interval: 'daily',
            series_type: 'close',
            apikey: this.ALPHA_VANTAGE_API_KEY
          }
        }),
        axios.get(this.BASE_URL, {
          params: {
            function: 'SMA',
            symbol: symbol,
            interval: 'daily',
            time_period: 50,
            series_type: 'close',
            apikey: this.ALPHA_VANTAGE_API_KEY
          }
        })
      ]);

      // Check for API errors in technical indicators
      if (rsiResponse.data['Error Message'] || macdResponse.data['Error Message'] || smaResponse.data['Error Message']) {
        throw new Error('Invalid stock symbol for technical indicators');
      }

      if (rsiResponse.data['Note'] || macdResponse.data['Note'] || smaResponse.data['Note']) {
        throw new Error('API call frequency limit reached for technical indicators');
      }

      return {
        rsi: rsiResponse.data,
        macd: macdResponse.data,
        sma: smaResponse.data
      };
    } catch (error) {
      if (error.response) {
        throw new Error(`Technical indicators API Error: ${error.response.status}`);
      }
      throw error;
    }
  }

  analyzeStock(stockData, technicalData) {
    console.log('Raw stockData keys:', Object.keys(stockData));
    console.log('Full stockData:', JSON.stringify(stockData, null, 2));
    
    const timeSeries = stockData['Time Series (Daily)'];
    
    if (!timeSeries) {
      throw new Error('No time series data available');
    }
    
    const dates = Object.keys(timeSeries).sort().reverse();
    
    const latestDate = dates[0];
    const previousDate = dates[1];
    
    const latestPrice = parseFloat(timeSeries[latestDate]['4. close']);
    const previousPrice = parseFloat(timeSeries[previousDate]['4. close']);
    const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;
    
    const volume = parseInt(timeSeries[latestDate]['5. volume']);
    const avgVolume = this.calculateAverageVolume(timeSeries, dates.slice(0, 10));
    
    const rsiData = technicalData.rsi['Technical Analysis: RSI'] || {};
    const macdData = technicalData.macd['Technical Analysis: MACD'] || {};
    const smaData = technicalData.sma['Technical Analysis: SMA'] || {};
    
    const rsiDates = Object.keys(rsiData).sort().reverse();
    const macdDates = Object.keys(macdData).sort().reverse();
    const smaDates = Object.keys(smaData).sort().reverse();
    
    const currentRSI = rsiDates.length > 0 ? parseFloat(rsiData[rsiDates[0]]['RSI']) : null;
    const currentMACD = macdDates.length > 0 ? parseFloat(macdData[macdDates[0]]['MACD']) : null;
    const currentSMA = smaDates.length > 0 ? parseFloat(smaData[smaDates[0]]['SMA']) : null;
    
    let signals = [];
    let score = 0;
    
    if (currentRSI !== null) {
      if (currentRSI > 70) {
        signals.push("RSI indicates overbought condition");
        score -= 1;
      } else if (currentRSI < 30) {
        signals.push("RSI indicates oversold condition");
        score += 1;
      }
    }
    
    if (currentMACD !== null) {
      if (currentMACD > 0) {
        signals.push("MACD shows bullish momentum");
        score += 1;
      } else {
        signals.push("MACD shows bearish momentum");
        score -= 1;
      }
    }
    
    if (currentSMA !== null && latestPrice > currentSMA) {
      signals.push("Price is above 50-day moving average");
      score += 1;
    } else if (currentSMA !== null) {
      signals.push("Price is below 50-day moving average");
      score -= 1;
    }
    
    if (volume > avgVolume * 1.5) {
      signals.push("High volume activity detected");
      score += 0.5;
    }
    
    if (priceChange > 5) {
      signals.push("Strong positive price movement");
      score += 1;
    } else if (priceChange < -5) {
      signals.push("Strong negative price movement");
      score -= 1;
    }
    
    let recommendation;
    let reason;
    
    if (score >= 2) {
      recommendation = "BUY";
      reason = "Multiple bullish indicators suggest upward momentum";
    } else if (score <= -2) {
      recommendation = "SELL";
      reason = "Multiple bearish indicators suggest downward pressure";
    } else {
      recommendation = "HOLD";
      reason = "Mixed signals, recommend waiting for clearer trend";
    }
    
    return {
      symbol: stockData['Meta Data']['2. Symbol'],
      latestPrice,
      priceChange: priceChange.toFixed(2),
      volume,
      recommendation,
      reason,
      technicalIndicators: {
        rsi: currentRSI ? currentRSI.toFixed(2) : 'N/A',
        macd: currentMACD ? currentMACD.toFixed(4) : 'N/A',
        sma50: currentSMA ? currentSMA.toFixed(2) : 'N/A'
      },
      signals,
      confidence: Math.abs(score) >= 2 ? 'High' : Math.abs(score) >= 1 ? 'Medium' : 'Low'
    };
  }

  calculateAverageVolume(timeSeries, dates) {
    const volumes = dates.map(date => parseInt(timeSeries[date]['5. volume']));
    return volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  }

  async analyzeStockSymbol(symbol) {
    try {
      const stockData = await this.getStockData(symbol);
      const technicalData = await this.getTechnicalIndicators(symbol);
      
      
      return this.analyzeStock(stockData, technicalData);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StockAnalysisService;
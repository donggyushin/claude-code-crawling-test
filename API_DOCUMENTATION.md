# Stock Analysis API Documentation

## Overview
This API provides comprehensive stock analysis including price data, technical indicators, and investment recommendations powered by Alpha Vantage financial data.

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, no authentication is required for this API. The API uses Alpha Vantage API key configured in the server environment.

---

## Endpoints

### Stock Analysis

#### GET /stock/analyze/{symbol}

Analyzes a stock symbol and returns comprehensive technical analysis with investment recommendations.

**URL Parameters:**
- `symbol` (required): Stock ticker symbol (e.g., TSLL, AAPL, GOOGL)

**Request Example:**
```bash
curl -X GET "http://localhost:3000/stock/analyze/TSLL"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "symbol": "TSLL",
    "latestPrice": 11.53,
    "priceChange": "-0.43",
    "volume": 91041950,
    "recommendation": "HOLD",
    "reason": "Mixed signals, recommend waiting for clearer trend",
    "technicalIndicators": {
      "rsi": "45.44",
      "macd": "N/A",
      "sma50": "12.44"
    },
    "signals": [
      "Price is below 50-day moving average"
    ],
    "confidence": "Medium"
  },
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `data` | object | Contains the analysis results |
| `data.symbol` | string | Stock ticker symbol |
| `data.latestPrice` | number | Current stock price |
| `data.priceChange` | string | Price change percentage from previous day |
| `data.volume` | number | Trading volume for the latest day |
| `data.recommendation` | string | Investment recommendation: "BUY", "SELL", or "HOLD" |
| `data.reason` | string | Explanation for the recommendation |
| `data.technicalIndicators` | object | Technical analysis indicators |
| `data.technicalIndicators.rsi` | string | Relative Strength Index (14-day) |
| `data.technicalIndicators.macd` | string | Moving Average Convergence Divergence |
| `data.technicalIndicators.sma50` | string | 50-day Simple Moving Average |
| `data.signals` | array | Array of technical analysis signals |
| `data.confidence` | string | Confidence level: "High", "Medium", or "Low" |
| `timestamp` | string | ISO 8601 timestamp of the analysis |

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message in Korean",
  "details": "Detailed error message (development mode only)",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

### HTTP Status Codes and Error Messages

#### 400 Bad Request
**Cause:** Missing or empty stock symbol

**Response:**
```json
{
  "success": false,
  "error": "Stock symbol is required",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

#### 404 Not Found
**Cause:** Invalid stock symbol

**Response:**
```json
{
  "success": false,
  "error": "유효하지 않은 주식 심볼입니다.",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

#### 429 Too Many Requests
**Cause:** API rate limit exceeded

**Response:**
```json
{
  "success": false,
  "error": "API 호출 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

#### 502 Bad Gateway
**Cause:** External API service issues

**Response:**
```json
{
  "success": false,
  "error": "외부 API 서비스에 문제가 있습니다.",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

#### 500 Internal Server Error
**Cause:** General server error

**Response:**
```json
{
  "success": false,
  "error": "주식 분석 중 오류가 발생했습니다.",
  "timestamp": "2025-07-06T07:44:36.734Z"
}
```

---

## Technical Indicators Explained

### RSI (Relative Strength Index)
- **Range:** 0-100
- **Interpretation:**
  - Above 70: Overbought (potential sell signal)
  - Below 30: Oversold (potential buy signal)
  - 30-70: Neutral zone

### MACD (Moving Average Convergence Divergence)
- **Interpretation:**
  - Positive value: Bullish momentum
  - Negative value: Bearish momentum
  - Zero crossover: Potential trend change

### SMA50 (50-day Simple Moving Average)
- **Interpretation:**
  - Price above SMA50: Bullish trend
  - Price below SMA50: Bearish trend

---

## Investment Recommendations

### BUY
- **Criteria:** Score >= 2
- **Meaning:** Multiple bullish indicators suggest upward momentum
- **Confidence:** Based on number and strength of positive signals

### SELL
- **Criteria:** Score <= -2  
- **Meaning:** Multiple bearish indicators suggest downward pressure
- **Confidence:** Based on number and strength of negative signals

### HOLD
- **Criteria:** -2 < Score < 2
- **Meaning:** Mixed signals, recommend waiting for clearer trend
- **Confidence:** Lower confidence due to conflicting indicators

---

## Rate Limits
- The API is subject to Alpha Vantage rate limits
- Standard Alpha Vantage API allows 5 requests per minute and 500 requests per day
- Rate limit exceeded errors will return HTTP 429 status code

---

## Example Usage

### JavaScript (Fetch API)
```javascript
fetch('http://localhost:3000/stock/analyze/TSLL')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Stock Analysis:', data.data);
      console.log('Recommendation:', data.data.recommendation);
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => console.error('Request failed:', error));
```

### Python (requests)
```python
import requests

response = requests.get('http://localhost:3000/stock/analyze/TSLL')
data = response.json()

if data['success']:
    analysis = data['data']
    print(f"Symbol: {analysis['symbol']}")
    print(f"Price: ${analysis['latestPrice']}")
    print(f"Recommendation: {analysis['recommendation']}")
    print(f"Confidence: {analysis['confidence']}")
else:
    print(f"Error: {data['error']}")
```

### cURL
```bash
# Basic request
curl -X GET "http://localhost:3000/stock/analyze/TSLL"

# With pretty printing
curl -X GET "http://localhost:3000/stock/analyze/TSLL" | jq

# Save to file
curl -X GET "http://localhost:3000/stock/analyze/TSLL" -o analysis.json
```

---

## Notes
- All prices are in USD
- Technical indicators are calculated using Alpha Vantage data
- Analysis is based on daily time series data
- The API returns the most recent trading day data
- Weekend and holiday requests will return the last trading day's data

---

## Web Crawling API

### Overview
The crawling API provides functionality to scrape venue data from Seoul date course websites, extracting information about LP bars and cafes.

### Endpoints

#### GET /crawling/scrape

Scrapes venue data from the target website and returns the extracted information.

**Request Example:**
```bash
curl -X GET "http://localhost:3000/crawling/scrape"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully scraped 5 venues",
  "title": "서울 감성충전소 LP바/카페 LIST",
  "data": [
    {
      "name": "후로아",
      "address": "중구 충무로2가",
      "country": "KR",
      "latitude": 37.56175342358275,
      "longitude": 126.98796641235397,
      "imageUrl": "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/썸네일.jpg",
      "storeId": "S230729_1690642444676",
      "tags": ["LP바", "카페", "감성", "서울", "데이트코스"]
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `message` | string | Success message with venue count |
| `title` | string | Title of the collection being scraped |
| `data` | array | Array of venue objects |
| `data[].name` | string | Venue name |
| `data[].address` | string | Venue address (district level) |
| `data[].country` | string | Country code (KR for South Korea) |
| `data[].latitude` | number | Venue latitude coordinates |
| `data[].longitude` | number | Venue longitude coordinates |
| `data[].imageUrl` | string | URL to venue image |
| `data[].storeId` | string | Unique store identifier extracted from URL |
| `data[].tags` | array | Array of tags associated with the venue |

#### POST /crawling/scrape-and-save

Scrapes venue data and saves it to a file in the specified format.

**Request Body:**
```json
{
  "format": "json",
  "filename": "custom_filename.json"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | No | File format: "json" or "csv" (default: "json") |
| `filename` | string | No | Custom filename (default: auto-generated with timestamp) |

**Request Example:**
```bash
curl -X POST "http://localhost:3000/crawling/scrape-and-save" \
  -H "Content-Type: application/json" \
  -d '{"format": "json", "filename": "seoul_venues.json"}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully scraped 5 venues and saved to file",
  "title": "서울 감성충전소 LP바/카페 LIST",
  "scrapeData": {
    "count": 5,
    "venues": [
      {
        "name": "후로아",
        "address": "중구 충무로2가",
        "country": "KR",
        "latitude": 37.56175342358275,
        "longitude": 126.98796641235397,
        "imageUrl": "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/썸네일.jpg",
        "storeId": "S230729_1690642444676",
        "tags": ["LP바", "카페", "감성", "서울", "데이트코스"]
      }
    ]
  },
  "fileData": {
    "success": true,
    "filename": "seoul_venues.json",
    "path": "/path/to/project/data/seoul_venues.json",
    "count": 5
  }
}
```

### Error Handling

#### 500 Internal Server Error
**Cause:** Scraping failure or server error

**Response:**
```json
{
  "success": false,
  "message": "Failed to scrape venues",
  "error": "Network timeout or parsing error"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

### Data Source
- **Target Website:** https://xn--2s2b33eb3kgvpta.com/collection/7
- **Data Format:** JSON-LD structured data
- **Venue Types:** LP bars and cafes in Seoul
- **Data Extraction:** Parses schema.org LocalBusiness entities

### Technical Details
- **Scraping Method:** Axios HTTP requests with Cheerio HTML parsing
- **Data Structure:** JSON-LD ItemList with LocalBusiness items
- **File Storage:** Saves to `/data` directory in project root
- **Supported Formats:** JSON and CSV export

### Example Usage

#### JavaScript (Fetch API)
```javascript
// Scrape data only
fetch('http://localhost:3000/crawling/scrape')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`Found ${data.data.length} venues`);
      data.data.forEach(venue => {
        console.log(`${venue.name} - ${venue.address}`);
      });
    }
  });

// Scrape and save to file
fetch('http://localhost:3000/crawling/scrape-and-save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ format: 'csv' })
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`Saved ${data.fileData.count} venues to ${data.fileData.filename}`);
    }
  });
```

#### Python (requests)
```python
import requests

# Scrape data
response = requests.get('http://localhost:3000/crawling/scrape')
data = response.json()

if data['success']:
    venues = data['data']
    print(f"Found {len(venues)} venues:")
    for venue in venues:
        print(f"- {venue['name']}: {venue['address']}")

# Scrape and save
payload = {"format": "json", "filename": "my_venues.json"}
response = requests.post('http://localhost:3000/crawling/scrape-and-save', json=payload)
result = response.json()

if result['success']:
    print(f"Saved to {result['fileData']['filename']}")
```

### Notes
- The scraper targets a specific Korean website about Seoul date course venues
- Data includes LP bars and cafes with their locations and details
- Geographic coordinates are provided for mapping integration
- Image URLs point to venue photos hosted on CDN
- Tags provide categorization for each venue (LP바, 카페, 감성, 서울, 데이트코스)
- The title field contains the collection name from the source website
- Store ID is a unique identifier extracted from the venue URL for reference
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

#### POST /crawling/scrape-and-save-to-mongodb

Scrapes venue data and saves it directly to MongoDB.

**Request Body:**
```json
{
  "collection": "venues"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection` | string | No | MongoDB collection name (default: "venues") |

**Request Example:**
```bash
curl -X POST "http://localhost:3000/crawling/scrape-and-save-to-mongodb" \
  -H "Content-Type: application/json" \
  -d '{"collection": "seoul_venues"}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully scraped 5 venues and saved to MongoDB",
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
  "mongoData": {
    "success": true,
    "inserted": 3,
    "updated": 2,
    "total": 5,
    "collection": "venues"
  }
}
```

#### GET /crawling/venues

Retrieves venue data from MongoDB with optional filtering.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection` | string | No | MongoDB collection name (default: "venues") |
| `name` | string | No | Filter by venue name (case-insensitive regex) |
| `address` | string | No | Filter by address (case-insensitive regex) |
| `storeId` | string | No | Filter by exact store ID |

**Request Examples:**
```bash
# Get all venues
curl -X GET "http://localhost:3000/crawling/venues"

# Filter by name
curl -X GET "http://localhost:3000/crawling/venues?name=후로아"

# Filter by address
curl -X GET "http://localhost:3000/crawling/venues?address=중구"

# Get from specific collection
curl -X GET "http://localhost:3000/crawling/venues?collection=seoul_venues"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 5 venues from MongoDB",
  "collection": "venues",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "후로아",
      "address": "중구 충무로2가",
      "country": "KR",
      "latitude": 37.56175342358275,
      "longitude": 126.98796641235397,
      "imageUrl": "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/썸네일.jpg",
      "storeId": "S230729_1690642444676",
      "tags": ["LP바", "카페", "감성", "서울", "데이트코스"],
      "createdAt": "2025-07-06T10:30:00.000Z",
      "updatedAt": "2025-07-06T10:30:00.000Z"
    }
  ]
}
```

#### DELETE /crawling/venues

Deletes venue data from MongoDB with optional filtering.

**Request Body:**
```json
{
  "collection": "venues",
  "storeId": "S230729_1690642444676"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `collection` | string | No | MongoDB collection name (default: "venues") |
| `storeId` | string | No | Delete specific venue by store ID |
| `name` | string | No | Delete venues by exact name match |

**Request Examples:**
```bash
# Delete specific venue by store ID
curl -X DELETE "http://localhost:3000/crawling/venues" \
  -H "Content-Type: application/json" \
  -d '{"storeId": "S230729_1690642444676"}'

# Delete all venues (use with caution!)
curl -X DELETE "http://localhost:3000/crawling/venues" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Deleted 1 venues from MongoDB",
  "collection": "venues",
  "deletedCount": 1
}
```

### MongoDB Data Structure

When data is saved to MongoDB, each venue document includes additional metadata:

```json
{
  "_id": "ObjectId",
  "name": "후로아",
  "address": "중구 충무로2가",
  "country": "KR",
  "latitude": 37.56175342358275,
  "longitude": 126.98796641235397,
  "imageUrl": "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/썸네일.jpg",
  "storeId": "S230729_1690642444676",
  "tags": ["LP바", "카페", "감성", "서울", "데이트코스"],
  "createdAt": "2025-07-06T10:30:00.000Z",
  "updatedAt": "2025-07-06T10:30:00.000Z"
}
```

**Additional Fields:**
- `_id`: MongoDB ObjectId (auto-generated)
- `createdAt`: Timestamp when the document was first created
- `updatedAt`: Timestamp when the document was last updated

**Upsert Behavior:**
- Documents are upserted based on the `storeId` field
- If a venue with the same `storeId` exists, it will be updated
- If no venue exists with that `storeId`, a new document will be created

#### GET /crawling/store/{storeId}

Fetches detailed information for a specific store using its store ID.

**URL Parameters:**
- `storeId` (required): Store identifier (e.g., S230729_1690642444676)

**Request Example:**
```bash
curl -X GET "http://localhost:3000/crawling/store/S230729_1690642444676"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully retrieved store details for S230729_1690642444676",
  "data": {
    "storeId": "S230729_1690642444676",
    "storeUrl": "https://xn--2s2b33eb3kgvpta.com/store/S230729_1690642444676",
    "name": "후로아",
    "description": "@furoa.seoul\n음악과 패션 그리고 카페. 브런치와 다양한 카페 메뉴를 함께 즐길 수 있는 LP판들이 가득 담긴 카페.",
    "address": {
      "full": "충무로2가 61-2 1층",
      "locality": "중구",
      "region": "서울특별시",
      "country": "KR"
    },
    "phone": "0507-1353-0857",
    "rating": 4.3,
    "reviewCount": 8,
    "latitude": 37.56175342358275,
    "longitude": 126.98796641235397,
    "images": [
      "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/썸네일.jpg",
      "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/방문자6.jpg"
    ],
    "additionalImages": [
      "http://d2m29rwiahucy3.cloudfront.net/images/store/S230729_1690642444676/1.jpg"
    ]
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `message` | string | Success message with store ID |
| `data` | object | Store detail information |
| `data.storeId` | string | Unique store identifier |
| `data.storeUrl` | string | Full URL to the store page |
| `data.name` | string | Store name |
| `data.description` | string | Detailed store description |
| `data.address` | object | Address information |
| `data.address.full` | string | Full street address |
| `data.address.locality` | string | City/District |
| `data.address.region` | string | State/Province |
| `data.address.country` | string | Country code |
| `data.phone` | string | Contact phone number |
| `data.rating` | number | Average rating (1-5 scale) |
| `data.reviewCount` | number | Number of reviews |
| `data.latitude` | number | Latitude coordinates |
| `data.longitude` | number | Longitude coordinates |
| `data.images` | array | Array of main store image URLs |
| `data.additionalImages` | array | Array of additional gallery image URLs |
| `data.businessHours` | string | Business hours (if available) |

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Store ID is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to retrieve store details",
  "error": "Store not found or network error"
}
```

### Example Usage

#### JavaScript (Fetch API)
```javascript
// Get store details
fetch('http://localhost:3000/crawling/store/S230729_1690642444676')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Store Name:', data.data.name);
      console.log('Rating:', data.data.rating);
      console.log('Phone:', data.data.phone);
      console.log('Description:', data.data.description);
    }
  });
```

#### Python (requests)
```python
import requests

store_id = "S230729_1690642444676"
response = requests.get(f'http://localhost:3000/crawling/store/{store_id}')
data = response.json()

if data['success']:
    store = data['data']
    print(f"Store: {store['name']}")
    print(f"Rating: {store['rating']}/5 ({store['reviewCount']} reviews)")
    print(f"Address: {store['address']['full']}")
    print(f"Phone: {store['phone']}")
```

### Notes
- The scraper targets a specific Korean website about Seoul date course venues
- Data includes LP bars and cafes with their locations and details
- Geographic coordinates are provided for mapping integration
- Image URLs point to venue photos hosted on CDN
- Tags provide categorization for each venue (LP바, 카페, 감성, 서울, 데이트코스)
- The title field contains the collection name from the source website
- Store ID is a unique identifier extracted from the venue URL for reference
- MongoDB operations require a valid database connection configured in environment variables
- All MongoDB operations use upsert logic to prevent duplicate entries based on `storeId`
- Store detail API provides comprehensive information including ratings, reviews, and image galleries
- Store IDs can be obtained from the main venue listing API endpoints
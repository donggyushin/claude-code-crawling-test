# claude-code-crawling-test

A secure Node.js Express API server with essential middleware and security features.

## Features

- **Express.js** - Fast, unopinionated web framework
- **Security** - Helmet.js for security headers
- **CORS** - Cross-origin resource sharing enabled
- **Logging** - Morgan HTTP request logger
- **Environment Variables** - dotenv configuration
- **Development Mode** - Nodemon for auto-restart

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3000 by default, or use the `PORT` environment variable.

## API Endpoints

- `GET /` - Health check endpoint returning server status
- `GET /health` - Database connectivity health check

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
```

## Dependencies

### Production
- **express** - Web framework
- **cors** - CORS middleware
- **helmet** - Security middleware
- **morgan** - HTTP request logger
- **dotenv** - Environment variable loader
- **mongodb** - MongoDB driver for Node.js

### Development
- **nodemon** - Development server with auto-restart

## License

ISC
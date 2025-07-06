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

## Deployment

### Deploy to Render (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect settings from `render.yaml`

4. **Set Environment Variables**
   - In Render dashboard, go to Environment
   - Add:
     - `MONGODB_USERNAME`: your MongoDB username
     - `MONGODB_PASSWORD`: your MongoDB password

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://your-app-name.onrender.com`

### Testing Deployment
- Visit `/` for basic health check
- Visit `/health` for database connectivity check

## License

ISC
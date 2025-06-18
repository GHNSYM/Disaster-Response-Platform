# Disaster Response Coordination Platform

A MERN stack application for coordinating disaster response efforts using real-time data aggregation and AI-powered analysis.

## Project Structure

```
disaster-response-platform/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers/
│   │   ├── disasterController.js
│   │   ├── socialMediaController.js
│   │   ├── resourceController.js
│   │   └── verificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── disasterRoutes.js
│   │   ├── socialMediaRoutes.js
│   │   └── resourceRoutes.js
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── geocodingService.js
│   │   ├── socialMediaService.js
│   │   └── cacheService.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   └── app.js
├── .env
├── .gitignore
└── package.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_api_key
   MAPS_API_KEY=your_maps_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- Disaster Data Management (CRUD operations)
- Location Extraction and Geocoding
- Real-Time Social Media Monitoring
- Geospatial Resource Mapping
- Official Updates Aggregation
- Image Verification
- Backend Optimization with Supabase

## API Endpoints

- POST /disasters - Create new disaster
- GET /disasters - List all disasters
- GET /disasters/:id - Get disaster details
- PUT /disasters/:id - Update disaster
- DELETE /disasters/:id - Delete disaster
- GET /disasters/:id/social-media - Get social media reports
- GET /disasters/:id/resources - Get nearby resources
- GET /disasters/:id/official-updates - Get official updates
- POST /disasters/:id/verify-image - Verify disaster image
- POST /geocode - Extract and geocode location

## Technologies Used

- Node.js & Express.js
- Supabase (PostgreSQL)
- Socket.IO
- Google Gemini API
- Google Maps API
- Winston (Logging)
- Express Rate Limit 
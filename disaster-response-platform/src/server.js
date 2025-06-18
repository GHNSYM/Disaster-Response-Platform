require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeSocket } = require('./services/socketService');
const { testConnection } = require('./config/database');
const logger = require('./config/logger');

// Import routes
const disasterRoutes = require('./routes/disasterRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

// Create Express app
const app = express();

// Security middleware with CSP configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.jsdelivr.net',
                'https://cdn.socket.io',
                'https://unpkg.com'
            ],
            scriptSrcAttr: ["'unsafe-inline'"],  // Allow inline event handlers
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.jsdelivr.net',
                'https://unpkg.com',
                'https://fonts.googleapis.com'
            ],
            imgSrc: [
                "'self'",
                'data:',
                'https:'
            ],
            connectSrc: [
                "'self'",
                'wss:',
                'ws:'
            ],
            fontSrc: [
                "'self'",
                'https://cdn.jsdelivr.net',
                'https://unpkg.com',
                'https://fonts.gstatic.com'
            ]
        }
    }
}));

app.use(cors());
app.use(express.json());

// Rate limiting
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/disasters', disasterRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/disasters', socialMediaRoutes);
app.use('/disasters', resourceRoutes);
app.use('/api/verify', verificationRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Error handling
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Set port
const port = process.env.PORT || 3000;

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to database');
        }

        // Start server
        server.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer(); 
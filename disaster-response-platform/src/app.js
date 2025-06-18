const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const disasterRoutes = require('./routes/disasterRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(rateLimiter);

// Routes
app.use('/api/disasters', disasterRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/verify', verificationRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app; 
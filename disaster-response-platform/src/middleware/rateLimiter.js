const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// Configure rate limiter
const rateLimiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: options.message
        });
    }
});

module.exports = {
    rateLimiter
}; 
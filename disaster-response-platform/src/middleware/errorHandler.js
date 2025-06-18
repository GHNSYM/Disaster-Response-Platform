const logger = require('../config/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    errorHandler
}; 
const { findNearbyResources } = require('../services/resourceService');
const logger = require('../config/logger');

/**
 * Get nearby resources for a disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getResources(req, res) {
    try {
        const { id: disasterId } = req.params;
        const { lat, lng, radius = 10 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const resources = await findNearbyResources(
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(radius)
        );

        logger.info('Resources retrieved successfully', {
            disasterId,
            resourceCount: resources.length
        });

        res.json(resources);
    } catch (error) {
        logger.error('Error fetching resources:', error);
        res.status(500).json({ 
            error: 'Failed to fetch resources',
            message: error.message
        });
    }
}

module.exports = {
    getResources
}; 
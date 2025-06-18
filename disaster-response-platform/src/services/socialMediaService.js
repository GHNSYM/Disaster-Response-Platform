const logger = require('../config/logger');
const { cacheService } = require('./cacheService');

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get social media feed for a disaster
 * @param {string} disasterId - Disaster ID
 * @param {string} title - Disaster title
 * @returns {Promise<Array>} Array of social media posts
 */
async function getSocialMediaFeed(disasterId, title) {
    try {
        // Validate inputs
        if (!disasterId) {
            throw new Error('Disaster ID is required');
        }
        if (!title) {
            throw new Error('Disaster title is required');
        }

        // Check cache first
        const cacheKey = `social_media_${disasterId}`;
        const cachedFeed = await cacheService.get(cacheKey);
        if (cachedFeed) {
            logger.info('Returning cached social media feed');
            return cachedFeed;
        }

    // Generate mock posts
        const posts = [
            {
                id: 'mock_1',
                text: `🚨 Emergency Update: Response teams are on the scene at ${title}.`,
                author: 'emergency_services',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                source: 'mock'
            },
            {
                id: 'mock_2',
                text: `📢 Community Alert: Local shelters have been set up for those affected by ${title}.`,
                author: 'local_authorities',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
                source: 'mock'
            },
            {
                id: 'mock_3',
                text: `ℹ️ Weather Update: Conditions are improving in the affected areas of ${title}.`,
                author: 'weather_service',
                timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
                source: 'mock'
            },
            {
                id: 'mock_4',
                text: `⚠️ Medical Alert: Medical teams are providing assistance at ${title}.`,
                author: 'medical_team',
                timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
                source: 'mock'
            },
            {
                id: 'mock_5',
                text: `🔔 Aid Update: Red Cross is distributing supplies in ${title}.`,
                author: 'redcross',
                timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
                source: 'mock'
            }
        ];

        // Cache results
        await cacheService.set(cacheKey, posts, CACHE_TTL);

    return posts;
  } catch (error) {
        logger.error('Error getting social media feed:', error);
    throw error;
  }
}

module.exports = {
    getSocialMediaFeed
}; 
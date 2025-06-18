const { getSocialMediaFeed } = require('../services/socialMediaService');
const logger = require('../config/logger');

/**
 * Get social media feed for a disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getFeed(req, res) {
  try {
        const { disaster_id } = req.params;
        const { title } = req.query;

        if (!disaster_id) {
            return res.status(400).json({ error: 'Disaster ID is required' });
        }

        const feed = await getSocialMediaFeed(disaster_id, title || 'the affected area');
        
        // Format the response to match frontend expectations
        const formattedFeed = feed.map(post => ({
            id: post.id,
            content: post.text,
            username: post.author,
            platform: post.source,
            timestamp: post.timestamp,
            location: title || 'the affected area',
            is_priority: post.text.includes('🚨') || post.text.includes('⚠️')
        }));

        logger.info('Social media feed retrieved successfully', {
            disasterId: disaster_id,
            postCount: formattedFeed.length
        });

        res.json(formattedFeed);
  } catch (error) {
        logger.error('Error getting social media feed:', error);
        res.status(500).json({ 
            error: 'Failed to get social media feed',
            message: error.message
        });
  }
}

module.exports = {
    getFeed
}; 
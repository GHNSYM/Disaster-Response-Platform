const { BskyAgent } = require('@atproto/api');
const logger = require('../config/logger');
const { cacheService } = require('./cacheService');

const agent = new BskyAgent({
    service: 'https://bsky.social'
});

// Rate limiting configuration
const RATE_LIMIT = {
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    currentRequests: 0,
    resetTime: Date.now()
};

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Authenticate with Bluesky
 * @returns {Promise<boolean>} Authentication status
 */
async function authenticate() {
    try {
        // Check if we're rate limited
        if (isRateLimited()) {
            logger.warn('Rate limit reached for Bluesky API');
            return false;
        }

        // Check cache for existing session
        const cachedSession = await cacheService.get('bluesky_session');
        if (cachedSession) {
            agent.session = cachedSession;
            return true;
        }

        // Validate credentials
        if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
            logger.error('Missing Bluesky credentials');
            throw new Error('Missing Bluesky credentials');
        }

        // Attempt authentication
        await agent.login({
            identifier: process.env.BLUESKY_IDENTIFIER,
            password: process.env.BLUESKY_PASSWORD
        });

        // Cache the session
        await cacheService.set('bluesky_session', agent.session, CACHE_TTL);
        
        // Update rate limit counter
        updateRateLimit();
        
        return true;
    } catch (error) {
        logger.error('Error authenticating with Bluesky:', error);
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

/**
 * Check if we're currently rate limited
 * @returns {boolean} Rate limit status
 */
function isRateLimited() {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now > RATE_LIMIT.resetTime + RATE_LIMIT.windowMs) {
        RATE_LIMIT.currentRequests = 0;
        RATE_LIMIT.resetTime = now;
    }
    
    return RATE_LIMIT.currentRequests >= RATE_LIMIT.maxRequests;
}

/**
 * Update rate limit counter
 */
function updateRateLimit() {
    RATE_LIMIT.currentRequests++;
}

/**
 * Search for posts related to a disaster
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of posts
 */
async function searchPosts(query) {
    try {
        // Validate query
        if (!query) {
            throw new Error('Search query is required');
        }

        // Check cache first
        const cacheKey = `bluesky_posts_${query}`;
        const cachedPosts = await cacheService.get(cacheKey);
        if (cachedPosts) {
            logger.info('Returning cached Bluesky posts');
            return cachedPosts;
        }

        // Authenticate if needed
        if (!agent.session) {
            const authSuccess = await authenticate();
            if (!authSuccess) {
                throw new Error('Failed to authenticate with Bluesky');
            }
        }

        // Check rate limit
        if (isRateLimited()) {
            logger.warn('Rate limit reached, returning mock data');
            return getMockPosts(query);
        }

        // Search posts
        const response = await agent.searchPosts({
            q: query,
            limit: 10
        });

        if (!response?.data?.posts) {
            logger.warn('No posts found, returning mock data');
            return getMockPosts(query);
        }

        // Update rate limit
        updateRateLimit();

        // Cache results
        await cacheService.set(cacheKey, response.data.posts, CACHE_TTL);

        return response.data.posts;
    } catch (error) {
        logger.error('Error fetching Bluesky posts:', error);
        
        // Return mock data for specific error cases
        if (error.message.includes('Rate Limit') || 
            error.message.includes('429') || 
            error.message.includes('Authentication failed')) {
            logger.info('Returning mock data due to error:', error.message);
            return getMockPosts(query);
        }
        
        throw error;
    }
}

/**
 * Get mock posts for fallback
 * @param {string} query - Search query
 * @returns {Array} Mock posts
 */
function getMockPosts(query) {
    return [
        {
            text: `[MOCK] Update about ${query}: Emergency services are responding to the situation.`,
            author: { handle: 'emergency_services' },
            indexedAt: new Date().toISOString()
        },
        {
            text: `[MOCK] Community update: Local shelters are open for those affected by ${query}.`,
            author: { handle: 'community_org' },
            indexedAt: new Date().toISOString()
        }
    ];
}

module.exports = {
    searchPosts,
    authenticate
}; 
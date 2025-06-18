const logger = require('../config/logger');

class CacheService {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {Promise<any>} Cached value or null
     */
    async get(key) {
        try {
            const item = this.cache.get(key);
            if (!item) return null;

            // Check if item has expired
            if (item.expiry && item.expiry < Date.now()) {
                this.cache.delete(key);
                return null;
            }

            return item.value;
        } catch (error) {
            logger.error('Cache get error:', error);
            return null;
        }
    }

    /**
     * Set a value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     * @returns {Promise<void>}
     */
    async set(key, value, ttl = 5 * 60 * 1000) { // Default 5 minutes
        try {
            this.cache.set(key, {
                value,
                expiry: Date.now() + ttl
            });
        } catch (error) {
            logger.error('Cache set error:', error);
        }
    }

    /**
     * Delete a value from cache
     * @param {string} key - Cache key
     * @returns {Promise<void>}
     */
    async delete(key) {
        try {
            this.cache.delete(key);
        } catch (error) {
            logger.error('Cache delete error:', error);
        }
    }

    /**
     * Clear all cache
     * @returns {Promise<void>}
     */
    async clear() {
        try {
            this.cache.clear();
        } catch (error) {
            logger.error('Cache clear error:', error);
        }
    }
}

// Create a singleton instance
const cacheService = new CacheService();

module.exports = {
    cacheService
}; 
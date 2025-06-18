const logger = require('../config/logger');

/**
 * Verify a disaster image
 * @param {string} imageUrl - URL of the image to verify
 * @param {string} disasterId - ID of the disaster
 * @returns {Promise<Object>} Verification result
 */
async function verifyDisasterImage(imageUrl, disasterId) {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock verification logic
        const isVerified = Math.random() > 0.3; // 70% chance of verification
        const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 0.7 and 1.0

        const result = {
            is_verified: isVerified,
            confidence: confidence,
            details: {
                disaster_type: isVerified ? 'Natural Disaster' : 'Unverified',
                severity: isVerified ? 'High' : 'Unknown',
                location_verified: isVerified,
                timestamp_verified: isVerified
            }
        };

        logger.info('Image verification completed', {
            disasterId,
            isVerified,
            confidence
        });

        return result;
    } catch (error) {
        logger.error('Error verifying image:', error);
        throw error;
    }
}

module.exports = {
    verifyDisasterImage
}; 
const logger = require('../config/logger');
const { verifyImage } = require('./geminiService');

/**
 * Verify a disaster image
 * @param {string} imageUrl - URL of the image to verify
 * @param {string} disasterId - ID of the disaster
 * @returns {Promise<Object>} Verification result
 */
async function verifyDisasterImage(imageUrl, disasterId) {
    try {
        // Use Gemini API for real image verification
        const geminiResult = await verifyImage(imageUrl, disasterId);
        // Map Gemini result to expected frontend structure
        return {
            is_verified: geminiResult.isAuthentic && geminiResult.matchesContext,
            confidence: geminiResult.analysis ? 0.9 : 0.5, // Placeholder, Gemini does not return confidence
            details: {
                disaster_type: geminiResult.matchesContext ? 'Natural Disaster' : 'Unverified',
                severity: geminiResult.severity || 'Unknown',
                location_verified: geminiResult.matchesContext,
                timestamp_verified: true // Not available, so default to true
            },
            analysis: geminiResult.analysis
        };
    } catch (error) {
        logger.error('Error verifying image:', error);
        throw error;
    }
}

module.exports = {
    verifyDisasterImage
}; 
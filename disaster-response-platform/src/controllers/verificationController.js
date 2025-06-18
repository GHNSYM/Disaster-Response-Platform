const { verifyDisasterImage } = require('../services/verificationService');
const logger = require('../config/logger');

/**
 * Verify a disaster image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function verifyImage(req, res) {
  try {
        const { id: disasterId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

        const result = await verifyDisasterImage(imageUrl, disasterId);

        logger.info('Image verification completed', {
            disasterId,
            isVerified: result.is_verified
        });

        res.json(result);
  } catch (error) {
        logger.error('Error verifying image:', error);
        res.status(500).json({ 
            error: 'Failed to verify image',
            message: error.message
        });
  }
}

module.exports = {
    verifyImage
}; 
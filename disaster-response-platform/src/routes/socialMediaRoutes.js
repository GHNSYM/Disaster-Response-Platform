const express = require('express');
const router = express.Router();
const { getFeed } = require('../controllers/socialMediaController');

// Get social media feed for a disaster
router.get('/:disaster_id/social-media', getFeed);

module.exports = router; 
const express = require('express');
const router = express.Router();
const { verifyImage } = require('../controllers/verificationController');

// Verify disaster image
router.post('/:id/verify-image', verifyImage);

module.exports = router; 
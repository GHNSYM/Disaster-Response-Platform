const express = require('express');
const router = express.Router();
const { getResources } = require('../controllers/resourceController');

// Get nearby resources for a disaster
router.get('/:id/resources', getResources);

module.exports = router; 
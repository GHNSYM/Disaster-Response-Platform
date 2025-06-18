const express = require('express');
const router = express.Router();
const {
  createDisaster,
  getDisasters,
  getDisaster,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');

// Create a new disaster
router.post('/', createDisaster);

// Get all disasters
router.get('/', getDisasters);

// Get a specific disaster
router.get('/:id', getDisaster);

// Update a disaster
router.put('/:id', updateDisaster);

// Delete a disaster
router.delete('/:id', deleteDisaster);

module.exports = router; 
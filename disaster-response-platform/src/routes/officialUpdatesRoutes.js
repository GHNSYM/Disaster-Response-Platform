const express = require('express');
const router = express.Router();
const { fetchOfficialUpdates } = require('../services/officialUpdatesService');

router.get('/', async (req, res) => {
  try {
    const updates = await fetchOfficialUpdates();
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch official updates' });
  }
});

module.exports = router; 
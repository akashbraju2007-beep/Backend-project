const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

// GET /api/matches
router.get('/', protect, getMatches);

module.exports = router;

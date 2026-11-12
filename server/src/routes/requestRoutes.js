const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');
const {
  exchangeRequestValidation,
  requestStatusValidation
} = require('../middleware/validation');

// All request routes require authentication
router.use(protect);

// POST /api/requests (create exchange request)
// GET /api/requests (get sent and received requests)
router.route('/')
  .post(exchangeRequestValidation, createRequest)
  .get(getRequests);

// PATCH /api/requests/:id (accept or reject)
router.patch('/:id', requestStatusValidation, updateRequestStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const {
  listingValidation,
  listingUpdateValidation
} = require('../middleware/validation');

// Public: GET /api/listings
// Private: POST /api/listings
router.route('/')
  .get(getListings)
  .post(protect, listingValidation, createListing);

// Public: GET /api/listings/:id
// Private: PUT /api/listings/:id (owner only)
// Private: DELETE /api/listings/:id (owner only)
router.route('/:id')
  .get(getListingById)
  .put(protect, listingUpdateValidation, updateListing)
  .delete(protect, deleteListing);

module.exports = router;

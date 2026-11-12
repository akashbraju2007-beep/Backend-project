const Listing = require('../models/Listing');
const { getIsMemoryMode } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const createListing = async (req, res, next) => {
  try {
    const { skillOffered, skillWanted, description, level, status } = req.body;
    const userId = req.user._id || req.user.id;

    if (getIsMemoryMode()) {
      const listing = memoryStore.createListing({
        userId,
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim(),
        description: description.trim(),
        level,
        status: status || 'open'
      });
      return res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        listing
      });
    }

    const listing = await Listing.create({
      user: userId,
      skillOffered: skillOffered.trim(),
      skillWanted: skillWanted.trim(),
      description: description.trim(),
      level,
      status: status || 'open'
    });

    const populatedListing = await Listing.findById(listing._id).populate(
      'user',
      'name email bio createdAt'
    );

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: populatedListing
    });
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const { search, skill, skillOffered, skillWanted, level, status, user } = req.query;

    if (getIsMemoryMode()) {
      const listings = memoryStore.findListings({ search, skill, skillOffered, skillWanted, level, status, user });
      return res.status(200).json({
        success: true,
        count: listings.length,
        listings
      });
    }

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'open';
    }

    if (user) query.user = user;
    if (level && ['beginner', 'intermediate', 'advanced'].includes(level)) {
      query.level = level;
    }

    if (skill) {
      const skillRegex = new RegExp(skill.trim(), 'i');
      query.$or = [{ skillOffered: skillRegex }, { skillWanted: skillRegex }];
    }

    if (skillOffered) query.skillOffered = new RegExp(skillOffered.trim(), 'i');
    if (skillWanted) query.skillWanted = new RegExp(skillWanted.trim(), 'i');

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { skillOffered: searchRegex },
        { skillWanted: searchRegex },
        { description: searchRegex }
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const listings = await Listing.find(query)
      .populate('user', 'name email bio createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    if (getIsMemoryMode()) {
      const listing = memoryStore.findListingById(req.params.id);
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      return res.status(200).json({ success: true, listing });
    }

    const listing = await Listing.findById(req.params.id).populate(
      'user',
      'name email bio createdAt'
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (getIsMemoryMode()) {
      const listing = memoryStore.findListingById(req.params.id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
      const ownerId = (listing.user?._id || listing.user?.id || listing.user).toString();
      if (ownerId !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized: You can only edit your own listings' });
      }
      const updated = memoryStore.updateListing(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Listing updated successfully', listing: updated });
    }

    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized: You can only edit your own listings' });
    }

    const { skillOffered, skillWanted, description, level, status } = req.body;
    const fieldsToUpdate = {};
    if (skillOffered !== undefined) fieldsToUpdate.skillOffered = skillOffered.trim();
    if (skillWanted !== undefined) fieldsToUpdate.skillWanted = skillWanted.trim();
    if (description !== undefined) fieldsToUpdate.description = description.trim();
    if (level !== undefined) fieldsToUpdate.level = level;
    if (status !== undefined) fieldsToUpdate.status = status;

    listing = await Listing.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true, runValidators: true }).populate('user', 'name email bio createdAt');

    res.status(200).json({ success: true, message: 'Listing updated successfully', listing });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (getIsMemoryMode()) {
      const listing = memoryStore.findListingById(req.params.id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
      const ownerId = (listing.user?._id || listing.user?.id || listing.user).toString();
      if (ownerId !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized: You can only delete your own listings' });
      }
      memoryStore.deleteListing(req.params.id);
      return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized: You can only delete your own listings' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
};

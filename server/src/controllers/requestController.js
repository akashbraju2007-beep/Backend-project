const ExchangeRequest = require('../models/ExchangeRequest');
const Listing = require('../models/Listing');
const { getIsMemoryMode } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const createRequest = async (req, res, next) => {
  try {
    const { listing: listingId, message } = req.body;
    const fromUserId = (req.user._id || req.user.id).toString();

    if (getIsMemoryMode()) {
      const listing = memoryStore.findListingById(listingId);
      if (!listing) return res.status(404).json({ success: false, message: 'Skill listing not found' });
      const ownerId = (listing.user?._id || listing.user?.id || listing.user).toString();
      if (ownerId === fromUserId) {
        return res.status(400).json({ success: false, message: 'You cannot request a skill exchange with your own listing' });
      }
      const newReq = memoryStore.createRequest({ fromUserId, listingId, message: message.trim() });
      return res.status(201).json({
        success: true,
        message: 'Exchange request sent successfully',
        request: newReq
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Skill listing not found'
      });
    }

    if (listing.user.toString() === fromUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request a skill exchange with your own listing'
      });
    }

    const existingRequest = await ExchangeRequest.findOne({
      fromUser: fromUserId,
      listing: listingId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `You already have an active (${existingRequest.status}) exchange request for this listing`
      });
    }

    const exchangeRequest = await ExchangeRequest.create({
      fromUser: fromUserId,
      toUser: listing.user,
      listing: listingId,
      message: message.trim()
    });

    const populatedRequest = await ExchangeRequest.findById(exchangeRequest._id)
      .populate('fromUser', 'name email bio')
      .populate('toUser', 'name email bio')
      .populate('listing', 'skillOffered skillWanted description level status');

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully',
      request: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const { type } = req.query;

    if (getIsMemoryMode()) {
      const { sent, received } = memoryStore.findRequests(userId, type);
      return res.status(200).json({
        success: true,
        counts: {
          sent: sent.length,
          received: received.length,
          pendingReceived: received.filter(r => r.status === 'pending').length
        },
        sent,
        received
      });
    }

    let sent = [];
    let received = [];

    if (!type || type === 'sent' || type === 'all') {
      sent = await ExchangeRequest.find({ fromUser: userId })
        .populate('toUser', 'name email bio')
        .populate('listing', 'skillOffered skillWanted description level status')
        .sort({ createdAt: -1 });
    }

    if (!type || type === 'received' || type === 'all') {
      received = await ExchangeRequest.find({ toUser: userId })
        .populate('fromUser', 'name email bio')
        .populate('listing', 'skillOffered skillWanted description level status')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      counts: {
        sent: sent.length,
        received: received.length,
        pendingReceived: received.filter(r => r.status === 'pending').length
      },
      sent,
      received
    });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const userId = (req.user._id || req.user.id).toString();

    if (getIsMemoryMode()) {
      const request = memoryStore.findRequestById(requestId);
      if (!request) return res.status(404).json({ success: false, message: 'Exchange request not found' });
      const recipientId = (request.toUser?._id || request.toUser?.id || request.toUser).toString();
      if (recipientId !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized: Only the recipient can accept or reject this request' });
      }
      const updated = memoryStore.updateRequestStatus(requestId, status);
      return res.status(200).json({
        success: true,
        message: `Exchange request ${status} successfully`,
        request: updated
      });
    }

    const exchangeRequest = await ExchangeRequest.findById(requestId)
      .populate('fromUser', 'name email bio')
      .populate('toUser', 'name email bio')
      .populate('listing');

    if (!exchangeRequest) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found'
      });
    }

    if (exchangeRequest.toUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: Only the recipient can accept or reject this request'
      });
    }

    exchangeRequest.status = status;
    await exchangeRequest.save();

    if (status === 'accepted' && exchangeRequest.listing) {
      await Listing.findByIdAndUpdate(exchangeRequest.listing._id, {
        status: 'matched'
      });
    }

    res.status(200).json({
      success: true,
      message: `Exchange request ${status} successfully`,
      request: exchangeRequest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};

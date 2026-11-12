const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'fromUser reference is required']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'toUser reference is required']
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: [true, 'Listing reference is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: '{VALUE} is not a valid status (must be pending, accepted, or rejected)'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exchangeRequestSchema.index({ fromUser: 1, toUser: 1, listing: 1 });

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);

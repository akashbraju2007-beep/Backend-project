const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Listing user reference is required']
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true,
    maxlength: [100, 'Skill offered cannot exceed 100 characters']
  },
  skillWanted: {
    type: String,
    required: [true, 'Skill wanted is required'],
    trim: true,
    maxlength: [100, 'Skill wanted cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  level: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: '{VALUE} is not a valid level (must be beginner, intermediate, or advanced)'
    },
    required: [true, 'Proficiency level is required']
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'matched'],
      message: '{VALUE} is not a valid status (must be open or matched)'
    },
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for text search and frequent queries
listingSchema.index({ skillOffered: 'text', skillWanted: 'text', description: 'text' });
listingSchema.index({ status: 1, skillOffered: 1, skillWanted: 1 });

module.exports = mongoose.model('Listing', listingSchema);

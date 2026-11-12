const Listing = require('../models/Listing');
const { getIsMemoryMode } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getMatches = async (req, res, next) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (getIsMemoryMode()) {
      const matchResults = memoryStore.getReciprocalMatches(userId);
      return res.status(200).json({
        success: true,
        ...matchResults
      });
    }

    const myListings = await Listing.find({
      user: userId,
      status: 'open'
    }).sort({ createdAt: -1 });

    if (!myListings.length) {
      return res.status(200).json({
        success: true,
        message: 'No open listings found. Create a listing to start discovering reciprocal skill exchanges!',
        myListingsCount: 0,
        matches: [],
        partialMatches: []
      });
    }

    const matches = [];
    const seenMatchPairs = new Set();

    for (const myListing of myListings) {
      const offeredSkill = myListing.skillOffered.trim();
      const wantedSkill = myListing.skillWanted.trim();

      const reciprocalQuery = {
        user: { $ne: userId },
        status: 'open',
        skillOffered: new RegExp(`^${escapeRegex(wantedSkill)}$`, 'i'),
        skillWanted: new RegExp(`^${escapeRegex(offeredSkill)}$`, 'i')
      };

      const matchedListings = await Listing.find(reciprocalQuery)
        .populate('user', 'name email bio createdAt')
        .sort({ createdAt: -1 });

      for (const matched of matchedListings) {
        const pairKey = `${myListing._id.toString()}-${matched._id.toString()}`;
        if (!seenMatchPairs.has(pairKey)) {
          seenMatchPairs.add(pairKey);
          matches.push({
            myListing: {
              _id: myListing._id,
              skillOffered: myListing.skillOffered,
              skillWanted: myListing.skillWanted,
              description: myListing.description,
              level: myListing.level,
              status: myListing.status,
              createdAt: myListing.createdAt
            },
            matchedListing: matched,
            matchType: 'exact_reciprocal',
            exchangeSummary: `You teach ${myListing.skillOffered} & learn ${myListing.skillWanted} 🔄 ${matched.user?.name || 'Classmate'} teaches ${matched.skillOffered} & learns ${matched.skillWanted}`
          });
        }
      }
    }

    const partialMatches = [];
    const matchedIds = new Set(matches.map(m => m.matchedListing._id.toString()));

    for (const myListing of myListings) {
      const wantedSkill = myListing.skillWanted.trim();

      const offersWhatYouWant = await Listing.find({
        user: { $ne: userId },
        status: 'open',
        _id: { $nin: Array.from(matchedIds) },
        skillOffered: new RegExp(`^${escapeRegex(wantedSkill)}$`, 'i')
      }).populate('user', 'name email bio createdAt').limit(3);

      for (const item of offersWhatYouWant) {
        partialMatches.push({
          myListing: {
            _id: myListing._id,
            skillOffered: myListing.skillOffered,
            skillWanted: myListing.skillWanted,
            level: myListing.level
          },
          matchedListing: item,
          matchType: 'offers_what_you_want',
          exchangeSummary: `${item.user?.name || 'Classmate'} offers ${item.skillOffered} (which you want to learn!)`
        });
      }
    }

    res.status(200).json({
      success: true,
      myListingsCount: myListings.length,
      totalMatches: matches.length,
      matches,
      partialMatches
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatches
};

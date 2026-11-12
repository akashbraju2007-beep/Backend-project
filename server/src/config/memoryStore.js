const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const generateObjectId = () => new mongoose.Types.ObjectId().toString();

class MemoryStore {
  constructor() {
    this.users = [];
    this.listings = [];
    this.requests = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    const hashedPassword = await bcrypt.hash('password123', 10);

    const u1 = {
      _id: '65f1a1a1a1a1a1a1a1a10001',
      id: '65f1a1a1a1a1a1a1a1a10001',
      name: 'Alex Rivera',
      email: 'alex@campus.edu',
      password: hashedPassword,
      bio: 'CS junior who loves Python, data analysis, and building automation scripts. Looking to level up my design eye.',
      createdAt: new Date()
    };

    const u2 = {
      _id: '65f1a1a1a1a1a1a1a1a10002',
      id: '65f1a1a1a1a1a1a1a1a10002',
      name: 'Maya Lin',
      email: 'maya@campus.edu',
      password: hashedPassword,
      bio: 'Digital Arts student specializing in Figma UI/UX, user testing, and visual identity. Eager to code my own projects!',
      createdAt: new Date()
    };

    const u3 = {
      _id: '65f1a1a1a1a1a1a1a1a10003',
      id: '65f1a1a1a1a1a1a1a1a10003',
      name: 'Liam Chen',
      email: 'liam@campus.edu',
      password: hashedPassword,
      bio: 'Mechanical Engineering sophomore. Math nerd who enjoys explaining calculus intuitively. Planning a semester in Spain!',
      createdAt: new Date()
    };

    const u4 = {
      _id: '65f1a1a1a1a1a1a1a1a10004',
      id: '65f1a1a1a1a1a1a1a1a10004',
      name: 'Sofia Rodriguez',
      email: 'sofia@campus.edu',
      password: hashedPassword,
      bio: 'Linguistics major and native Spanish speaker. I love languages and culture, but calculus is giving me a tough time.',
      createdAt: new Date()
    };

    const u5 = {
      _id: '65f1a1a1a1a1a1a1a1a10005',
      id: '65f1a1a1a1a1a1a1a1a10005',
      name: 'Jordan Taylor',
      email: 'jordan@campus.edu',
      password: hashedPassword,
      bio: 'Audio engineer and beatmaker. I can teach Ableton Live and sound design. Want to build a portfolio website in React.',
      createdAt: new Date()
    };

    const u6 = {
      _id: '65f1a1a1a1a1a1a1a1a10006',
      id: '65f1a1a1a1a1a1a1a1a10006',
      name: 'Priya Patel',
      email: 'priya@campus.edu',
      password: hashedPassword,
      bio: 'Web developer who builds with React & Tailwind. Looking for a creative outlet to learn music production.',
      createdAt: new Date()
    };

    this.users = [u1, u2, u3, u4, u5, u6];

    // Listings (all using valid 24-hex-character ObjectIds)
    this.listings = [
      {
        _id: '65f1b2b2b2b2b2b2b2b20001',
        id: '65f1b2b2b2b2b2b2b2b20001',
        user: u1,
        skillOffered: 'Python',
        skillWanted: 'Figma UI/UX',
        description: 'I can teach Python fundamentals, data structures, automation scripts, and basic Pandas. Looking for someone to guide me through Figma prototyping, auto-layout, and design systems.',
        level: 'advanced',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
      },
      {
        _id: '65f1b2b2b2b2b2b2b2b20002',
        id: '65f1b2b2b2b2b2b2b2b20002',
        user: u2,
        skillOffered: 'Figma UI/UX',
        skillWanted: 'Python',
        description: 'Offering interactive prototyping, responsive component libraries, and UX wireframing in Figma. In exchange, I want help learning Python for backend data scripting.',
        level: 'advanced',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5)
      },
      {
        _id: '65f1b2b2b2b2b2b2b2b20003',
        id: '65f1b2b2b2b2b2b2b2b20003',
        user: u3,
        skillOffered: 'Calculus',
        skillWanted: 'Spanish',
        description: 'Can tutor Single and Multivariable Calculus, limits, derivatives, integration techniques, and exam prep. Seeking conversational Spanish practice and grammar tips.',
        level: 'advanced',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
      },
      {
        _id: '65f1b2b2b2b2b2b2b2b20004',
        id: '65f1b2b2b2b2b2b2b2b20004',
        user: u4,
        skillOffered: 'Spanish',
        skillWanted: 'Calculus',
        description: 'Native Spanish speaker offering conversation practice, pronunciation coaching, and grammar tutoring. I need patient help passing my Calculus I course!',
        level: 'advanced',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18)
      },
      {
        _id: '65f1b2b2b2b2b2b2b2b20005',
        id: '65f1b2b2b2b2b2b2b2b20005',
        user: u5,
        skillOffered: 'Music Production',
        skillWanted: 'React',
        description: 'Experienced in Ableton Live, Logic Pro, EQ, compression, and beat making. Looking for someone to teach me React components and state management for an interactive web synth project.',
        level: 'intermediate',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
      },
      {
        _id: '65f1b2b2b2b2b2b2b2b20006',
        id: '65f1b2b2b2b2b2b2b2b20006',
        user: u6,
        skillOffered: 'React',
        skillWanted: 'Music Production',
        description: 'Can teach modern React (hooks, custom hooks, context, Tailwind CSS integration, Vite). Want to learn DAW basics and how to create electronic music tracks.',
        level: 'advanced',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
      }
    ];

    // Sample Requests
    this.requests = [
      {
        _id: '65f1c3c3c3c3c3c3c3c30001',
        id: '65f1c3c3c3c3c3c3c3c30001',
        fromUser: u2,
        toUser: u1,
        listing: this.listings[0],
        message: 'Hi Alex! I saw you want to learn Figma UI/UX. I am a design student and would love to exchange Figma lessons for your Python guidance!',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
      },
      {
        _id: '65f1c3c3c3c3c3c3c3c30002',
        id: '65f1c3c3c3c3c3c3c3c30002',
        fromUser: u4,
        toUser: u3,
        listing: this.listings[2],
        message: 'Hola Liam! I would be delighted to practice conversational Spanish with you. I really need help with derivatives before midterms next week!',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20)
      }
    ];

    this.initialized = true;
  }

  // --- Users ---
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const user = this.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.password;
    return sanitized;
  }

  async createUser({ name, email, password, bio }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = generateObjectId();
    const newUser = {
      _id: newId,
      id: newId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      bio: bio || '',
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- Listings ---
  findListings({ search, skill, skillOffered, skillWanted, level, status, user }) {
    return this.listings.filter(listing => {
      // Status filter
      if (status && status !== 'all') {
        if (listing.status !== status) return false;
      } else if (!status) {
        if (listing.status !== 'open') return false;
      }

      // User filter
      if (user) {
        const listingUserId = listing.user?._id || listing.user?.id || listing.user;
        if (listingUserId !== user) return false;
      }

      // Level filter
      if (level && listing.level !== level) return false;

      // Skill filter
      if (skill) {
        const regex = new RegExp(skill.trim(), 'i');
        if (!regex.test(listing.skillOffered) && !regex.test(listing.skillWanted)) {
          return false;
        }
      }

      if (skillOffered) {
        const regex = new RegExp(skillOffered.trim(), 'i');
        if (!regex.test(listing.skillOffered)) return false;
      }

      if (skillWanted) {
        const regex = new RegExp(skillWanted.trim(), 'i');
        if (!regex.test(listing.skillWanted)) return false;
      }

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        const match = regex.test(listing.skillOffered) ||
                      regex.test(listing.skillWanted) ||
                      regex.test(listing.description);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findListingById(id) {
    return this.listings.find(l => l._id === id || l.id === id);
  }

  createListing({ userId, skillOffered, skillWanted, description, level, status }) {
    const user = this.findUserById(userId);
    const newId = generateObjectId();
    const newListing = {
      _id: newId,
      id: newId,
      user,
      skillOffered,
      skillWanted,
      description,
      level,
      status: status || 'open',
      createdAt: new Date()
    };
    this.listings.unshift(newListing);
    return newListing;
  }

  updateListing(id, updates) {
    const listing = this.findListingById(id);
    if (!listing) return null;
    Object.assign(listing, updates);
    return listing;
  }

  deleteListing(id) {
    const index = this.listings.findIndex(l => l._id === id || l.id === id);
    if (index === -1) return false;
    this.listings.splice(index, 1);
    return true;
  }

  // --- Reciprocal Matches ---
  getReciprocalMatches(userId) {
    const myListings = this.listings.filter(l => {
      const lUserId = l.user?._id || l.user?.id || l.user;
      return lUserId === userId && l.status === 'open';
    });

    if (!myListings.length) {
      return { myListingsCount: 0, matches: [], partialMatches: [] };
    }

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = [];
    const seen = new Set();

    for (const myListing of myListings) {
      const offered = myListing.skillOffered.trim();
      const wanted = myListing.skillWanted.trim();

      const offeredRegex = new RegExp(`^${escapeRegex(wanted)}$`, 'i');
      const wantedRegex = new RegExp(`^${escapeRegex(offered)}$`, 'i');

      const matchedListings = this.listings.filter(other => {
        const otherUserId = other.user?._id || other.user?.id || other.user;
        if (otherUserId === userId) return false;
        if (other.status !== 'open') return false;
        return offeredRegex.test(other.skillOffered.trim()) && wantedRegex.test(other.skillWanted.trim());
      });

      for (const matched of matchedListings) {
        const key = `${myListing._id}-${matched._id}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({
            myListing,
            matchedListing: matched,
            matchType: 'exact_reciprocal',
            exchangeSummary: `You teach ${myListing.skillOffered} & learn ${myListing.skillWanted} 🔄 ${matched.user?.name || 'Classmate'} teaches ${matched.skillOffered} & learns ${matched.skillWanted}`
          });
        }
      }
    }

    // Complementary recommendations
    const partialMatches = [];
    for (const myListing of myListings) {
      const wantedRegex = new RegExp(`^${escapeRegex(myListing.skillWanted.trim())}$`, 'i');
      const matchedIds = new Set(matches.map(m => m.matchedListing._id));

      const complementary = this.listings.filter(other => {
        const otherUserId = other.user?._id || other.user?.id || other.user;
        return otherUserId !== userId &&
               other.status === 'open' &&
               !matchedIds.has(other._id) &&
               wantedRegex.test(other.skillOffered.trim());
      }).slice(0, 3);

      for (const item of complementary) {
        partialMatches.push({
          myListing,
          matchedListing: item,
          matchType: 'offers_what_you_want',
          exchangeSummary: `${item.user?.name || 'Classmate'} offers ${item.skillOffered} (which you want to learn!)`
        });
      }
    }

    return {
      myListingsCount: myListings.length,
      totalMatches: matches.length,
      matches,
      partialMatches
    };
  }

  // --- Exchange Requests ---
  findRequests(userId, type = 'all') {
    let sent = [];
    let received = [];

    if (!type || type === 'sent' || type === 'all') {
      sent = this.requests.filter(r => {
        const fId = r.fromUser?._id || r.fromUser?.id || r.fromUser;
        return fId === userId;
      });
    }

    if (!type || type === 'received' || type === 'all') {
      received = this.requests.filter(r => {
        const tId = r.toUser?._id || r.toUser?.id || r.toUser;
        return tId === userId;
      });
    }

    return { sent, received };
  }

  findRequestById(id) {
    return this.requests.find(r => r._id === id || r.id === id);
  }

  createRequest({ fromUserId, listingId, message }) {
    const listing = this.findListingById(listingId);
    if (!listing) return null;

    const fromUser = this.findUserById(fromUserId);
    const toUser = listing.user;

    const newRequest = {
      _id: generateObjectId(),
      fromUser,
      toUser,
      listing,
      message,
      status: 'pending',
      createdAt: new Date()
    };

    this.requests.unshift(newRequest);
    return newRequest;
  }

  updateRequestStatus(requestId, status) {
    const request = this.findRequestById(requestId);
    if (!request) return null;
    request.status = status;
    if (status === 'accepted' && request.listing) {
      request.listing.status = 'matched';
    }
    return request;
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;

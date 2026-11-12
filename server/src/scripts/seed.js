const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const ExchangeRequest = require('../models/ExchangeRequest');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await ExchangeRequest.deleteMany({});
    console.log('Cleared existing database records.');

    // Create demo users
    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex@campus.edu',
        password: 'password123',
        bio: 'CS junior who loves Python, data analysis, and building automation scripts. Looking to level up my design eye.'
      },
      {
        name: 'Maya Lin',
        email: 'maya@campus.edu',
        password: 'password123',
        bio: 'Digital Arts student specializing in Figma UI/UX, user testing, and visual identity. Eager to code my own projects!'
      },
      {
        name: 'Liam Chen',
        email: 'liam@campus.edu',
        password: 'password123',
        bio: 'Mechanical Engineering sophomore. Math nerd who enjoys explaining calculus intuitively. Planning a semester in Spain!'
      },
      {
        name: 'Sofia Rodriguez',
        email: 'sofia@campus.edu',
        password: 'password123',
        bio: 'Linguistics major and native Spanish speaker. I love languages and culture, but calculus is giving me a tough time.'
      },
      {
        name: 'Jordan Taylor',
        email: 'jordan@campus.edu',
        password: 'password123',
        bio: 'Audio engineer and beatmaker. I can teach Ableton Live and sound design. Want to build a portfolio website in React.'
      },
      {
        name: 'Priya Patel',
        email: 'priya@campus.edu',
        password: 'password123',
        bio: 'Web developer who builds with React & Tailwind. Looking for a creative outlet to learn music production.'
      }
    ]);

    const [alex, maya, liam, sofia, jordan, priya] = users;
    console.log(`Created ${users.length} users.`);

    // Create listings with exact reciprocal pairings
    const listings = await Listing.create([
      // Reciprocal Pair 1: Alex & Maya
      {
        user: alex._id,
        skillOffered: 'Python',
        skillWanted: 'Figma UI/UX',
        description: 'I can teach Python fundamentals, data structures, automation scripts, and basic Pandas. Looking for someone to guide me through Figma prototyping, auto-layout, and design systems.',
        level: 'advanced',
        status: 'open'
      },
      {
        user: maya._id,
        skillOffered: 'Figma UI/UX',
        skillWanted: 'Python',
        description: 'Offering interactive prototyping, responsive component libraries, and UX wireframing in Figma. In exchange, I want help learning Python for backend data scripting.',
        level: 'advanced',
        status: 'open'
      },

      // Reciprocal Pair 2: Liam & Sofia
      {
        user: liam._id,
        skillOffered: 'Calculus',
        skillWanted: 'Spanish',
        description: 'Can tutor Single and Multivariable Calculus, limits, derivatives, integration techniques, and exam prep. Seeking conversational Spanish practice and grammar tips.',
        level: 'advanced',
        status: 'open'
      },
      {
        user: sofia._id,
        skillOffered: 'Spanish',
        skillWanted: 'Calculus',
        description: 'Native Spanish speaker offering conversation practice, pronunciation coaching, and grammar tutoring. I need patient help passing my Calculus I course!',
        level: 'advanced',
        status: 'open'
      },

      // Reciprocal Pair 3: Jordan & Priya
      {
        user: jordan._id,
        skillOffered: 'Music Production',
        skillWanted: 'React',
        description: 'Experienced in Ableton Live, Logic Pro, EQ, compression, and beat making. Looking for someone to teach me React components and state management for an interactive web synth project.',
        level: 'intermediate',
        status: 'open'
      },
      {
        user: priya._id,
        skillOffered: 'React',
        skillWanted: 'Music Production',
        description: 'Can teach modern React (hooks, custom hooks, context, Tailwind CSS integration, Vite). Want to learn DAW basics and how to create electronic music tracks.',
        level: 'advanced',
        status: 'open'
      },

      // Extra Listings
      {
        user: alex._id,
        skillOffered: 'Git & GitHub',
        skillWanted: 'Public Speaking',
        description: 'Can help you master Git branching, merge conflicts, pull requests, and GitHub Actions. Looking for tips to improve project presentations.',
        level: 'intermediate',
        status: 'open'
      },
      {
        user: maya._id,
        skillOffered: 'Logo & Graphic Design',
        skillWanted: 'JavaScript',
        description: 'Can teach Illustrator, typography, brand guidelines, and vector design. Want to learn modern vanilla JavaScript syntax and DOM manipulation.',
        level: 'intermediate',
        status: 'open'
      }
    ]);

    console.log(`Created ${listings.length} listings.`);

    // Create sample exchange requests
    const requests = await ExchangeRequest.create([
      {
        fromUser: maya._id,
        toUser: alex._id,
        listing: listings[0]._id, // Alex's Python listing
        message: 'Hi Alex! I saw you want to learn Figma UI/UX. I am a design student and would love to exchange Figma lessons for your Python guidance!',
        status: 'pending'
      },
      {
        fromUser: sofia._id,
        toUser: liam._id,
        listing: listings[2]._id, // Liam's Calculus listing
        message: 'Hola Liam! I would be delighted to practice conversational Spanish with you. I really need help with derivatives before midterms next week!',
        status: 'accepted'
      }
    ]);

    console.log(`Created ${requests.length} sample exchange requests.`);
    console.log('\nSeed completed successfully! ✨');
    console.log('\nDemo User Accounts (Password for all: password123):');
    users.forEach(u => console.log(` - ${u.name} (${u.email})`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

const mongoose = require('mongoose');
const memoryStore = require('./memoryStore');

let isMemoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500, // fast timeout: 1.5s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB offline (${error.message}). Activating In-Memory Campus Store...`);
    await memoryStore.init();
    isMemoryMode = true;
    console.log(`🚀 SkillSwap In-Memory Campus Store activated! Demo accounts & seed pairs loaded.`);
  }
};

const getIsMemoryMode = () => isMemoryMode;

module.exports = connectDB;
module.exports.getIsMemoryMode = getIsMemoryMode;

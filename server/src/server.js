const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to database / initialize store
connectDB().then(() => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 SkillSwap Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('\nClosing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
});

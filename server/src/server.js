const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// Connect to database / initialize store
connectDB().then(() => {
  const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`🚀 SkillSwap Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`📡 Health check available at: http://localhost:${port}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is already in use by another process.`);
        if (port === DEFAULT_PORT) {
          console.log(`🔄 Automatically attempting backup port ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error(`❌ Could not bind to port ${port}. Please free port ${DEFAULT_PORT}.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
      }
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
  };

  startServer(DEFAULT_PORT);
});

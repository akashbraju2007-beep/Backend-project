const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsMemoryMode } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_jwt_key_skillswap_2026'
      );

      let user;
      if (getIsMemoryMode()) {
        user = memoryStore.findUserById(decoded.id);
      } else {
        user = await User.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or authorization is invalid'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
        error: error.message
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided'
    });
  }
};

module.exports = { protect };

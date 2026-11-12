const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsMemoryMode } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_skillswap_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    if (getIsMemoryMode()) {
      const existing = memoryStore.findUserByEmail(cleanEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email address already exists'
        });
      }

      const user = await memoryStore.createUser({ name: name.trim(), email: cleanEmail, password, bio });
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          createdAt: user.createdAt
        }
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      bio: bio ? bio.trim() : ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    if (getIsMemoryMode()) {
      const user = memoryStore.findUserByEmail(cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let user;

    if (getIsMemoryMode()) {
      user = memoryStore.findUserById(userId);
    } else {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};

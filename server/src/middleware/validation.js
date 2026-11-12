const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return res.status(400).json({
      success: false,
      message: formattedErrors[0]?.message || 'Validation error',
      errors: formattedErrors
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

const listingValidation = [
  body('skillOffered')
    .trim()
    .notEmpty().withMessage('Skill offered is required')
    .isLength({ max: 100 }).withMessage('Skill offered cannot exceed 100 characters'),
  body('skillWanted')
    .trim()
    .notEmpty().withMessage('Skill wanted is required')
    .isLength({ max: 100 }).withMessage('Skill wanted cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('level')
    .trim()
    .notEmpty().withMessage('Skill level is required')
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Level must be beginner, intermediate, or advanced'),
  body('status')
    .optional()
    .isIn(['open', 'matched']).withMessage('Status must be open or matched'),
  validate
];

const listingUpdateValidation = [
  body('skillOffered')
    .optional()
    .trim()
    .notEmpty().withMessage('Skill offered cannot be empty')
    .isLength({ max: 100 }).withMessage('Skill offered cannot exceed 100 characters'),
  body('skillWanted')
    .optional()
    .trim()
    .notEmpty().withMessage('Skill wanted cannot be empty')
    .isLength({ max: 100 }).withMessage('Skill wanted cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('level')
    .optional()
    .trim()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Level must be beginner, intermediate, or advanced'),
  body('status')
    .optional()
    .isIn(['open', 'matched']).withMessage('Status must be open or matched'),
  validate
];

const exchangeRequestValidation = [
  body('listing')
    .trim()
    .notEmpty().withMessage('Listing ID is required')
    .custom((value) => {
      if (typeof value === 'string' && value.length >= 3 && value.length <= 64) {
        return true;
      }
      throw new Error('Invalid listing ID format');
    }),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 500 }).withMessage('Message must be between 5 and 500 characters'),
  validate
];

const requestStatusValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('Request ID is required')
    .custom((value) => {
      if (typeof value === 'string' && value.length >= 3 && value.length <= 64) {
        return true;
      }
      throw new Error('Invalid request ID format');
    }),
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  listingValidation,
  listingUpdateValidation,
  exchangeRequestValidation,
  requestStatusValidation
};

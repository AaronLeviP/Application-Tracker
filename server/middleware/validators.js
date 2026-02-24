const { body, validationResult } = require('express-validator');

// Validation rules for registration
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((value) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(value)) {
        throw new Error('Password must contain at least one number');
      }
      return true;
    })
];

// Validation rules for login
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.applicationValidation = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 1, max: 200 }).withMessage('Company name must be 1-200 characters'),
  
  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isLength({ min: 1, max: 200 }).withMessage('Position must be 1-200 characters'),
  
  body('status')
    .optional()
    .isIn(['Applied', 'Phone Screen', 'Technical Interview', 'Onsite', 'Offer', 'Rejected'])
    .withMessage('Invalid status'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
  
  body('followUpDate')
    .optional()
    .isISO8601().withMessage('Follow-up date must be a valid date')
];

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors for clean response
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};
const { body, validationResult } = require('express-validator');

// Validation and sanitization rules for the contact form
const contactValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage('Email address cannot exceed 150 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 7, max: 25 })
    .withMessage('Phone number must be between 7 and 25 characters'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject / Service is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Subject must be between 2 and 150 characters')
    .escape(),

  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company cannot exceed 100 characters')
    .escape(),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 5, max: 3000 })
    .withMessage('Message must be between 5 and 3000 characters')
    .escape()
];

// Middleware to check validation results and return clean, structured errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = {
  contactValidationRules,
  handleValidationErrors
};

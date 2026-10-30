const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { contactValidationRules, handleValidationErrors } = require('../middleware/validateContact');
const { contactLimiter } = require('../middleware/rateLimiter');

// Health check route
router.get('/health', contactController.getContactHealth);

// POST /api/contact - Submit contact enquiry
router.post(
  '/',
  contactLimiter,
  contactValidationRules,
  handleValidationErrors,
  contactController.submitContactForm
);

module.exports = router;

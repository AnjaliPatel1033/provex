const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { contactValidationRules, handleValidationErrors } = require('../middleware/validateContact');
const { contactLimiter } = require('../middleware/rateLimiter');
const { requireDatabase } = require('../config/db');

// Health check route
router.get('/health', contactController.getContactHealth);

// POST /api/contact - Submit contact enquiry
router.post(
  '/',
  requireDatabase,
  contactLimiter,
  contactValidationRules,
  handleValidationErrors,
  contactController.submitContactForm
);

module.exports = router;

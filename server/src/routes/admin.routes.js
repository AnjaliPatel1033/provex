const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/admin.controller');
const requireAdmin = require('../middleware/requireAdmin');
const { requireDatabase } = require('../config/db');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many login attempts. Try again later.' } });
router.use(requireDatabase);
router.post('/login', loginLimiter, controller.login);
router.use(requireAdmin);
router.get('/dashboard', controller.dashboard);
router.get('/inquiries', controller.listInquiries);
router.get('/inquiries/:id', controller.getInquiry);
router.patch('/inquiries/:id/status', controller.updateStatus);
router.delete('/inquiries/:id', controller.deleteInquiry);
module.exports = router;

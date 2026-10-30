const rateLimit = require('express-rate-limit');

// Rate limiting for the contact submission endpoint to prevent spam/abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 submissions per 15 minutes
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many contact requests from this IP address. Please try again after 15 minutes.'
  }
});

module.exports = {
  contactLimiter
};

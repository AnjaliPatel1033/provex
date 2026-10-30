/**
 * Centralized error handling middleware.
 * Ensures internal system details / stack traces are logged on the server
 * but not leaked to the client.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Server Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Check for payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large. Please reduce the size of your message.'
    });
  }

  // Mongoose validation error fallback
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Database validation failed',
      errors: messages
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: 'An unexpected error occurred while processing your request. Please try again later.'
  });
};

module.exports = errorHandler;

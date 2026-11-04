const mongoose = require('mongoose');

let connectionPromise;
let hasConnected = false;

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const requireDatabase = (req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again later.'
    });
  }

  return next();
};

const getSafeErrorMessage = (error) =>
  String(error.message).replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[MongoDB connection string redacted]');

mongoose.connection.on('disconnected', () => {
  if (hasConnected) {
    console.warn('[Database] MongoDB disconnected. Readiness checks will fail until the connection is restored.');
  }
});

mongoose.connection.on('reconnected', () => {
  hasConnected = true;
  console.log('[Database] MongoDB connection restored.');
});

mongoose.connection.on('error', (error) => {
  if (hasConnected) {
    console.error(`[Database Error] MongoDB connection error: ${getSafeErrorMessage(error)}`);
  }
});

const connectDB = () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    const error = new Error('MONGODB_URI is not configured. Set it in the server environment before starting the API.');
    console.error(`[Database Error] ${error.message}`);
    connectionPromise = Promise.reject(error);
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true
  }).then((connection) => {
    hasConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${connection.connection.host}/${connection.connection.name}`);
    return connection;
  }).catch((error) => {
    const safeMessage = getSafeErrorMessage(error);
    console.error(`[Database Error] Failed to connect to MongoDB: ${safeMessage}`);
    throw new Error(`MongoDB connection failed: ${safeMessage}`);
  });

  return connectionPromise;
};

module.exports = {
  connectDB,
  isDatabaseConnected,
  requireDatabase
};

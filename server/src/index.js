require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, isDatabaseConnected } = require('./config/db');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins for CORS (Local development, GitHub Pages, or any custom domain from CLIENT_URL)
const defaultAllowedOrigins = [
  'http://localhost:4200',
  'https://anjalipatel1033.github.io'
];
const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin header (Postman, curl, Render health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.github.io')
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// 3. Body Parsers with strict size limits to prevent DOS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. API Routes
app.use('/api/contact', contactRoutes);

// Health check root
app.get('/', (req, res) => {
  const databaseConnected = isDatabaseConnected();
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'online' : 'unavailable',
    app: 'Provex Website Backend API',
    version: '1.0.0',
    ...(databaseConnected ? {} : { message: 'Database unavailable' })
  });
});

// 5. 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// 6. Centralized Error Handler
app.use(errorHandler);

// Connect to MongoDB before accepting requests.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Express server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Server] Allowed CORS origins: ${allowedOrigins.join(', ')} (and any *.github.io)`);
  });
};

startServer().catch(() => {
  console.error('[Startup Error] API startup aborted. Express server was not started because MongoDB is unavailable.');
  process.exitCode = 1;
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS Configuration
app.use(
  cors({
    origin: CLIENT_URL,
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
  res.json({
    status: 'online',
    app: 'Provex Website Backend API',
    version: '1.0.0'
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

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Express server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Server] Accepting requests from: ${CLIENT_URL}`);
  });
});

module.exports = app;

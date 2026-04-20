/**
 * Main Express Application Setup
 * Configures middleware, security, efficiency, and routing.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const chatRoutes = require('./routes/chat');

const app = express();

// 1. Security: Helmet sets secure HTTP headers
app.use(helmet());

// 2. Efficiency: Compress response bodies
app.use(compression());

// 3. Security: Rate Limiting to prevent DDoS and API abuse
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 50 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Standard Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../public'))); // adjust path based on src location

// Apply rate limiter specifically to API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/chat', chatRoutes);

module.exports = app;

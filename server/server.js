// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path'); // Import path module
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const flashcardRoutes = require('./routes/flashcards');
const textRoutes = require('./routes/texts');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Serve Frontend Static Files ---
// Adjust the path to look for 'build' in the project root directory.
// __dirname is '/opt/render/project/src/server', so '../..' goes up to '/opt/render/project/src'
const buildPath = path.join(__dirname, '..', '..', 'build'); // <-- Corrected path
console.log('Looking for frontend build in:', buildPath); // Log for debugging

app.use(express.static(buildPath));

// Database connection (Updated: Removed deprecated options)
const mongoURI = process.env.MONGODB_URI;

// Basic check for MONGODB_URI in production-like environments (optional, but helpful)
if (!mongoURI && (process.env.NODE_ENV === 'production' || process.env.RENDER)) {
  console.error("❌ CRITICAL: MONGODB_URI environment variable is not set. Database connection will fail.");
  // Consider exiting if DB is critical: process.exit(1);
}

mongoose.connect(mongoURI || 'mongodb://localhost:27017/turkamerica')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    // Optionally, exit the process if DB connection is critical for your app
    // process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/texts', textRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// --- Catch-all route for frontend ---
// This should come AFTER your API routes but BEFORE the 404 handler.
// It sends the React app (or other SPA) for any non-API route.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler (Adjusted to be more specific to API routes)
// This will now primarily catch API routes that don't exist
app.use('/api/*', (req, res) => { // <-- Adjusted to only apply to /api paths
  res.status(404).json({ error: 'API Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ MongoDB connection status check completed.');
  console.log(`📱 Serving frontend static files from: ${buildPath}`); // Log path being used
});

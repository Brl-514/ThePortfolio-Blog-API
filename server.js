const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const adminResetRoutes = require('./routes/admin-reset');

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminResetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Server will start without database connection');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (without database)`);
      });
    });
} else {
  console.log('MONGODB_URI not set. Server will start without database connection.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (without database)`);
  });
}

module.exports = app;


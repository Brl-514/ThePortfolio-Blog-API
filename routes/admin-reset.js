const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Reset admin (delete existing admin and create new one)
router.post('/reset-admin', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    // Delete existing admin if exists
    await User.deleteMany({ role: 'admin' });

    // Create new admin user
    const admin = new User({ 
      email, 
      username, 
      password, 
      role: 'admin' 
    });
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin user reset successfully',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Reset admin error:', error);
    res.status(500).json({ message: 'Server error while resetting admin' });
  }
});

module.exports = router;

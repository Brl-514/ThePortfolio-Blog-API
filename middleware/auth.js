const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be defined');
  }
  return secret;
};

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const user = await User.findById(req.user.userId).select('role');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminMiddleware };


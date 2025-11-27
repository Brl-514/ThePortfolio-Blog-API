const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const messageValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public: submit contact form
router.post('/', messageValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const saved = await Message.create(req.body);
    res.status(201).json({ message: 'Message received', data: saved });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list all messages
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


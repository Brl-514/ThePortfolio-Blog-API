const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);


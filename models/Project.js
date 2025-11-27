const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  repoUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'other'],
    default: 'web'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);


const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const blogValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];
const blogUpdateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty')
];

const commentValidators = [
  body('body').trim().notEmpty().withMessage('Comment body is required')
];

// Get featured blog posts
router.get('/featured/list', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('-content')
      .populate('author', 'username');

    res.json(blogs);
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const query = { published: true };

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content')
      .populate('author', 'username')
      .exec();

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all blogs (including drafts)
router.get('/admin/list', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'username email');
    res.json(blogs);
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');

    if (!blog || (!blog.published)) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog post (admin)
router.post('/', authMiddleware, adminMiddleware, blogValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
      ...req.body,
      author: req.user.userId,
      tags: req.body.tags || []
    });

    await blog.save();
    const populated = await blog.populate('author', 'username email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post (admin)
router.put('/:id', authMiddleware, adminMiddleware, blogUpdateValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Comment.deleteMany({ post: blog._id });
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a blog
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment on blog (auth)
router.post('/:id/comments', authMiddleware, commentValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.published) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = await Comment.create({
      body: req.body.body,
      author: req.user.userId,
      post: blog._id
    });

    const populated = await comment.populate('author', 'username');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


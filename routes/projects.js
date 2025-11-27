const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const normalizeTechnologies = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((tech) => tech.trim()).filter(Boolean);
  }
  return [];
};

const projectValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
];
const updateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
];

// Public: Get all projects
router.get('/', async (req, res) => {
  try {
    const { featured, category } = req.query;
    const query = {};

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    const projects = await Project.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate('user', 'username email');

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'username email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: Create project
router.post('/', authMiddleware, adminMiddleware, projectValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = new Project({
      ...req.body,
      technologies: normalizeTechnologies(req.body.technologies),
      user: req.user.userId
    });

    await project.save();
    const populated = await project.populate('user', 'username email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: Update project
router.put('/:id', authMiddleware, adminMiddleware, updateValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {
      ...req.body,
      ...(req.body.technologies !== undefined && { technologies: normalizeTechnologies(req.body.technologies) })
    };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: Delete project
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


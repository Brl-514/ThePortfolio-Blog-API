/**
 * Database seeding utility
 * Run this script to populate the database with sample data
 * Usage: node utils/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Message = require('../models/Message');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Project.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Created regular user:', user.email);

    // Create sample blog posts
    const blogs = await Blog.create([
      {
        title: 'Welcome to My Blog',
        content: 'This is my first blog post. I\'m excited to share my thoughts and experiences with you. Stay tuned for more content!',
        author: admin._id,
        tags: ['welcome', 'introduction'],
        published: true,
        publishedAt: new Date()
      },
      {
        title: 'Getting Started with Web Development',
        content: 'Web development is an exciting field with many opportunities. In this post, I\'ll share some tips for beginners who want to start their journey in web development.\n\nFirst, choose a programming language to start with. JavaScript is a great choice as it can be used for both frontend and backend development.\n\nNext, practice regularly. Build small projects to reinforce what you learn. Don\'t be afraid to make mistakes - they are part of the learning process.',
        author: admin._id,
        tags: ['web development', 'tutorial', 'beginner'],
        published: true,
        publishedAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        title: 'Building Responsive Websites',
        content: 'Responsive design is crucial in today\'s mobile-first world. Your website should look great on all devices, from smartphones to desktop computers.\n\nUse CSS media queries to create responsive layouts. Test your designs on multiple devices and screen sizes. Consider using a mobile-first approach when designing.',
        author: admin._id,
        tags: ['responsive design', 'CSS', 'web design'],
        published: true,
        publishedAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ]);
    console.log(`Created ${blogs.length} blog posts`);

    // Create sample projects
    const projects = await Project.create([
      {
        title: 'E-Commerce Website',
        description: 'A fully functional e-commerce website built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration.',
        shortDescription: 'Modern e-commerce storefront with payments.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        liveUrl: 'https://example.com/store',
        repoUrl: 'https://github.com/example/store',
        category: 'web',
        featured: true,
        displayOrder: 1,
        user: admin._id
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application that allows teams to organize and track their work. Built with modern web technologies.',
        shortDescription: 'Collaborative productivity tool.',
        technologies: ['Vue.js', 'Firebase', 'CSS3'],
        liveUrl: 'https://example.com/tasks',
        repoUrl: 'https://github.com/example/tasks',
        category: 'web',
        featured: true,
        displayOrder: 2,
        user: admin._id
      },
      {
        title: 'Mobile Weather App',
        description: 'A beautiful weather application for mobile devices. Provides real-time weather updates and forecasts.',
        shortDescription: 'Weather insights on the go.',
        technologies: ['React Native', 'API Integration'],
        category: 'mobile',
        featured: true,
        displayOrder: 3,
        user: admin._id
      },
      {
        title: 'Portfolio Website',
        description: 'A personal portfolio website showcasing projects and skills. Clean and modern design with smooth animations.',
        shortDescription: 'Personal branding site.',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'web',
        featured: false,
        displayOrder: 4,
        user: admin._id
      }
    ]);
    console.log(`Created ${projects.length} projects`);

    // Create sample comments
    await Comment.create({
      body: 'Great insights! Looking forward to more posts.',
      author: user._id,
      post: blogs[0]._id
    });

    // Create sample contact message
    await Message.create({
      name: 'Potential Client',
      email: 'client@example.com',
      subject: 'Project Collaboration',
      message: 'Hi! I love your work and would like to discuss a new project.'
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User - Email: user@example.com, Password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;


/**
 * Script to create an admin user
 * Usage: node scripts/createAdmin.js <email> <username> <password>
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-blog';

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node scripts/createAdmin.js <email> <username> <password>');
    process.exit(1);
  }

  const [email, username, password] = args;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.error('User with this email or username already exists');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      email,
      username,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Username: ${admin.username}`);
    console.log(`Role: ${admin.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();


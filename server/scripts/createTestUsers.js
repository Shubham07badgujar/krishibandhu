// createTestUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/krishibandhu', {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create test users
const createTestUsers = async () => {
  try {
    // Check if users already exist
    const existingAdminCount = await User.countDocuments({ role: 'admin' });
    const existingUserCount = await User.countDocuments({ role: 'user' });
    
    console.log(`Existing admin users: ${existingAdminCount}`);
    console.log(`Existing regular users: ${existingUserCount}`);
    
    if (existingAdminCount > 0 && existingUserCount > 0) {
      console.log('Users already exist. No need to create test users.');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create a test admin user if none exists
    if (existingAdminCount === 0) {
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        village: 'AdminVillage',
        district: 'AdminDistrict',
        state: 'AdminState',
        phone: '9876543210',
        primaryCrop: 'Rice'
      });
      console.log('Admin user created:', adminUser.name);
    }
    
    // Create a test regular user if none exists
    if (existingUserCount === 0) {
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
        village: 'TestVillage',
        district: 'TestDistrict',
        state: 'TestState',
        phone: '1234567890',
        primaryCrop: 'Wheat'
      });
      console.log('Regular user created:', regularUser.name);
    }
    
    console.log('Test users created successfully!');
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

// Run the script
const runScript = async () => {
  const conn = await connectDB();
  await createTestUsers();
  mongoose.disconnect();
  console.log('Database connection closed');
};

runScript();
